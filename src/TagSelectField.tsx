'use client';

/**
 * TagSelectField - SV Design System
 *
 * A multi-select input that displays selected options as removable Chip tags.
 * Clicking the field opens a dropdown with checkboxes for all available options.
 * Typing in the input filters the dropdown options. Selected options appear as
 * inline chips with TagField's overflow logic (+N badge when collapsed).
 *
 * Props:
 *   label        - string    - label above field (omit to hide)
 *   tooltip      - string    - <IconTooltip> after label (requires label)
 *   options      - array     - { value: string, label: string }[] available options
 *   value        - string[]  - controlled list of selected option values
 *   onChange     - func      - (values: string[]) => void
 *   placeholder  - string    - input placeholder (default: 'Select options...')
 *   error        - string    - error message; triggers error border
 *   errorIcon    - ReactNode - icon in error row (default <WarningOutlineIcon />)
 *   disabled     - bool      - default: false
 *   size         - 'base' | 'small'  default: 'base'
 */

import React, { useState, useRef, useLayoutEffect, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import Tooltip from './Tooltip';
import Chip from './Chip';
import Checkbox from './Checkbox';
import SmoothBox from './SmoothBox';
import { WarningOutlineIcon, ChevronDownIcon } from './icons';
import { useDropdownPlacement } from './useDropdownPlacement';
import { useInheritedColorMode } from './useInheritedColorMode';
import {
  TagSelectWrapper,
  TagSelectLabelRow,
  TagSelectLabelText,
  TagSelectRequiredMark,
  TagSelectInputBox,
  TagSelectErrorRow,
  TagSelectErrorText,
  TagSelectOverflowWrap,
  TagSelectTooltipList,
  TagSelectTooltipItem,
  TagSelectRelativeBox,
  TagSelectFilterInput,
  TagSelectPlaceholder,
  TagSelectChevronBox,
  TagSelectMeasureRow,
  TagSelectMeasureChip,
  TagSelectDropdownList,
  TagSelectNoResults,
  TagSelectNoResultsText,
  TagSelectOptionRow,
  TagSelectOptionLabel,
} from './TagSelectField.styles';

type ColorModePaperSlotProps = NonNullable<React.ComponentProps<typeof Popover>['slotProps']>['paper'] & {
  'data-color-mode'?: 'light' | 'dark';
};

function getColorModePaperProps(
  mode: 'light' | 'dark' | undefined,
  sx: Record<string, unknown>,
): ColorModePaperSlotProps {
  return {
    ...(mode ? { 'data-color-mode': mode } : {}),
    sx,
  } as ColorModePaperSlotProps;
}

export interface TagSelectOption {
  value: string;
  label: string;
}

export interface TagSelectFieldProps {
  label?: string;
  hideLabel?: boolean;
  tooltip?: string;
  required?: boolean;
  options: TagSelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  errorIcon?: React.ReactNode;
  disabled?: boolean;
  size?: 'base' | 'small';
  sx?: SxProps<Theme>;
}

function OverflowBadge({ count, allLabels, size = 'small' }: { count: number; allLabels: string[]; size?: 'base' | 'small' }) {
  return (
    <Tooltip
      title={
        <TagSelectTooltipList>
          {allLabels.map((v) => (
            <TagSelectTooltipItem key={v}>{v}</TagSelectTooltipItem>
          ))}
        </TagSelectTooltipList>
      }
    >
      <TagSelectOverflowWrap component="span" isSmall={size === 'small'}>
        <Chip label={`+${count}`} size={size} style="duotone" color="default" />
      </TagSelectOverflowWrap>
    </Tooltip>
  );
}

export default function TagSelectField({
  label,
  hideLabel,
  tooltip,
  required = false,
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
  error,
  errorIcon,
  disabled = false,
  size = 'base',
  sx,
}: TagSelectFieldProps) {
  const theme = useTheme();
  const isSmall = size === 'small';
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(value.length);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { placement: dropdownPlacement, maxHeight: dropdownMaxHeight } = useDropdownPlacement(
    anchorRef.current,
    { open, maxHeight: 280 },
  );
  const isDropdownTop = dropdownPlacement === 'top';
  const inheritedMode = useInheritedColorMode(anchorRef.current, open);

  const isError = Boolean(error && !disabled);
  const isCollapsed = !open;

  // Build a lookup map for value -> label.
  const labelMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const opt of options) m.set(opt.value, opt.label);
    return m;
  }, [options]);

  // Selected option labels for chip display
  const selectedLabels = useMemo(
    () => value.map((v) => ({ value: v, label: labelMap.get(v) ?? v })),
    [value, labelMap]
  );

  // Filtered options for dropdown
  const filteredOptions = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(filter.toLowerCase())),
    [options, filter]
  );

  // Recalculate overflow when container resizes
  const [resizeTick, setResizeTick] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setResizeTick((t) => t + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Inline overflow measurement (same logic as TagField).
  useLayoutEffect(() => {
    if (!isCollapsed || !containerRef.current || !measureRef.current) {
      if (!isCollapsed) setVisibleCount(value.length);
      return;
    }
    const availableWidth = containerRef.current.clientWidth - 48; // padding + chevron space
    const gap = 8;
    const chipEls = Array.from(measureRef.current.querySelectorAll('[data-chip]')) as HTMLElement[];
    const badgeEl = measureRef.current.querySelector('[data-badge]') as HTMLElement | null;
    const badgeW = badgeEl ? badgeEl.offsetWidth + gap : 0;

    let usedWidth = 0;
    let count = 0;
    for (let i = 0; i < chipEls.length; i++) {
      const chipW = chipEls[i].offsetWidth;
      const next = usedWidth === 0 ? chipW : usedWidth + gap + chipW;
      const needed = i < chipEls.length - 1 ? next + badgeW : next;
      if (needed <= availableWidth) { usedWidth = next; count = i + 1; }
      else break;
    }
    setVisibleCount(count);
  }, [isCollapsed, value, resizeTick]);

  // Handlers.
  const handleToggle = useCallback(
    (optValue: string) => {
      if (value.includes(optValue)) {
        onChange?.(value.filter((v) => v !== optValue));
      } else {
        onChange?.([...value, optValue]);
      }
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (optValue: string) => onChange?.(value.filter((v) => v !== optValue)),
    [value, onChange]
  );

  const handleOpen = () => {
    if (disabled) return;
    setOpen(true);
    setFilter('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleClose = () => {
    setOpen(false);
    setFilter('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && filter === '' && value.length > 0) {
      onChange?.(value.slice(0, -1));
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const iconSz = isSmall ? 16 : 20;
  const chipsToShow = isCollapsed ? selectedLabels.slice(0, visibleCount) : selectedLabels;
  const hiddenCount = selectedLabels.length - visibleCount;

  return (
    <TagSelectWrapper data-annotation-target="TagSelectField" sx={sx}>
      {label && !hideLabel && (
        <TagSelectLabelRow>
          <TagSelectLabelText>{label}</TagSelectLabelText>
          {required && <TagSelectRequiredMark component="span">*</TagSelectRequiredMark>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </TagSelectLabelRow>
      )}

      <Box ref={anchorRef}>
        <TagSelectRelativeBox ref={containerRef}>
          <TagSelectInputBox
            onClick={handleOpen}
            isError={isError}
            isFocused={open}
            isDisabled={disabled}
            isSmall={isSmall}
            isCollapsed={isCollapsed}
          >
            {chipsToShow.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                size={isSmall ? 'small' : 'base'}
                onRemove={!disabled ? () => handleRemove(item.value) : undefined}
                noTruncate
              />
            ))}

            {isCollapsed && hiddenCount > 0 && <OverflowBadge count={hiddenCount} allLabels={selectedLabels.map((s) => s.label)} size={isSmall ? 'small' : 'base'} />}

            {/* Filter input; visible when dropdown is open. */}
            <TagSelectFilterInput
              inputRef={inputRef}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? placeholder : ''}
              disabled={disabled}
              isCollapsed={isCollapsed}
              isSmall={isSmall}
            />

            {/* Placeholder text when collapsed and empty */}
            {isCollapsed && value.length === 0 && (
              <TagSelectPlaceholder isSmall={isSmall}>
                {placeholder}
              </TagSelectPlaceholder>
            )}

            {/* Chevron indicator */}
            <TagSelectChevronBox isOpen={open}>
              <ChevronDownIcon size={iconSz} color={theme.semantic.text.secondary} />
            </TagSelectChevronBox>
          </TagSelectInputBox>

          {/* Hidden measurement DOM for inline overflow calculation */}
          {isCollapsed && (
            <TagSelectMeasureRow ref={measureRef} aria-hidden="true">
              {selectedLabels.map((item) => (
                <TagSelectMeasureChip key={item.value} data-chip>
                  <Chip label={item.label} size={isSmall ? 'small' : 'base'} onRemove={() => {}} />
                </TagSelectMeasureChip>
              ))}
              <TagSelectMeasureChip data-badge isSmall={isSmall}>
                <Chip label="+99" size={isSmall ? 'small' : 'base'} style="duotone" color="default" />
              </TagSelectMeasureChip>
            </TagSelectMeasureRow>
          )}
        </TagSelectRelativeBox>
      </Box>

      {/* Dropdown */}
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: isDropdownTop ? 'top' : 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: isDropdownTop ? 'bottom' : 'top', horizontal: 'left' }}
        disableAutoFocus
        disableEnforceFocus
        slotProps={{
          paper: getColorModePaperProps(inheritedMode, {
              mt: isDropdownTop ? 0 : theme.customSpacing[1],
              mb: isDropdownTop ? theme.customSpacing[1] : 0,
              borderRadius: theme.customBorderRadius.xl,
              overflow: 'visible',
              boxShadow: 'none',
              width: anchorRef.current?.offsetWidth ?? 'auto',
              bgcolor: theme.semantic.common.white,
              backgroundImage: theme.surfaceOverlay.high,
          }),
        }}
      >
        <SmoothBox
          smoothRadius={theme.customBorderRadius.xl}
          sx={{
            bgcolor: theme.semantic.common.white,
            backgroundImage: theme.surfaceOverlay.high,
            boxShadow: theme.customShadows.lg,
            border: `1px solid ${theme.semantic.divider}`,
            py: theme.customSpacing[2],
            maxHeight: dropdownMaxHeight,
            overflowY: 'auto',
          }}
        >
          {filteredOptions.length === 0 ? (
            <TagSelectNoResults>
              <TagSelectNoResultsText>No matching options</TagSelectNoResultsText>
            </TagSelectNoResults>
          ) : (
            <TagSelectDropdownList role="listbox">
              {filteredOptions.map((opt) => (
                <TagSelectOptionRow
                  key={opt.value}
                  role="option"
                  aria-selected={value.includes(opt.value)}
                  onClick={() => handleToggle(opt.value)}
                >
                  <Checkbox
                    checked={value.includes(opt.value)}
                    onChange={() => handleToggle(opt.value)}
                  />
                  <TagSelectOptionLabel isSmall={isSmall}>
                    {opt.label}
                  </TagSelectOptionLabel>
                </TagSelectOptionRow>
              ))}
            </TagSelectDropdownList>
          )}
        </SmoothBox>
      </Popover>

      {isError && (
        <TagSelectErrorRow>
          {errorIcon ?? <WarningOutlineIcon size={20} color={theme.semantic.error.main} />}
          <TagSelectErrorText>{error}</TagSelectErrorText>
        </TagSelectErrorRow>
      )}
    </TagSelectWrapper>
  );
}
