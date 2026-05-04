'use client';

/**
 * MultiselectField - SV Design System multi-select dropdown.
 * Source: Figma file OVjygxh5hpVujmD1gl4MB9, node 994-2050
 *
 * Props:
 *   variant        "default" | "ghost"                    default: "default"
 *   size           "base" | "small"                       default: "base"
 *   label          string                                  optional label above trigger
 *   placeholder    string                                  default: "Select options"
 *   value          string[]                               controlled selected values
 *   onChange       (values: string[]) => void
 *   options        Array<{ value: string, label: string }> used when no children
 *   comboInput     bool                                   default: false
 *   dropdownAlign  "left" | "right"                       default: "left"
 *   tooltip        string                                  optional tooltip
 *   disabled       bool                                   default: false
 *   children       ReactNode                              slot; replaces checkbox list in dropdown
 */

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import SmoothBox from './SmoothBox';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import Checkbox from './Checkbox';
import { ChevronDownIcon } from './icons';
import { useDropdownPlacement } from './useDropdownPlacement';
import { useInheritedColorMode } from './useInheritedColorMode';
import {
  DefaultRoot,
  GhostRoot,
  LabelRow,
  LabelText,
  RequiredAsterisk,
  OptionsListGap,
  GhostAnchorWrap,
  GhostTriggerButton,
  GhostDisplayText,
  GhostChevronIcon,
  MultiSelectTrigger,
  MultiSelectChevron,
  TriggerDisplayText,
  TriggerTrailingIcons,
  SelectedCountText,
  OverflowCountBadge,
  HiddenMeasureRow,
  InlineTooltipWrap,
  DropdownSearchSection,
  DropdownOptionsSection,
  DropdownOptionRow,
  DropdownOptionBadge,
  DropdownOptionLabel,
  DropdownEmptyMessage,
} from './MultiselectField.styles';
import { FieldOption } from './SelectField';
import TextInputField from './TextInputField';
import Tooltip from './Tooltip';
import { SearchIcon } from './icons';

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

/**
 * Optional leading badge for a dropdown option. Rendered to the left of the
 * option label with a fixed minWidth so sibling option labels stay aligned
 * regardless of badge content. Hovering the badge reveals the tooltip.
 */
export interface MultiselectOptionBadge {
  label: string;
  tooltip?: React.ReactNode;
}

/**
 * MultiselectField's option type extends the shared `FieldOption` (value +
 * label) with optional metadata specific to this dropdown: for now, a leading
 * badge. Consumers can pass plain `FieldOption`s too; badge is optional.
 */
export interface MultiselectFieldOption extends FieldOption {
  badge?: MultiselectOptionBadge;
}

export interface MultiselectFieldProps {
  variant?: 'default' | 'ghost';
  size?: 'base' | 'small';
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  value?: string[];
  onChange?: (values: string[]) => void;
  options?: MultiselectFieldOption[];
  comboInput?: boolean;
  dropdownAlign?: 'left' | 'right';
  tooltip?: string;
  required?: boolean;
  disabled?: boolean;
  /**
   * When true, renders a sticky search bar at the top of the dropdown that
   * filters the options list by their `label` (case-insensitive substring).
   * The search input is always base-sized regardless of the field's own
   * `size`, so it stays comfortable to type in.
   */
  searchable?: boolean;
  /** Placeholder for the dropdown's search input (only used when `searchable`). */
  searchPlaceholder?: string;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

// Popover dropdown (proper React component; hooks-safe).

interface PopoverDropdownProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  anchorOriginH: 'left' | 'right';
  transformOriginH: 'left' | 'right';
  isSlotted: boolean;
  children?: React.ReactNode;
  options: MultiselectFieldOption[];
  value: string[];
  onToggle: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}

function PopoverDropdown({
  open,
  anchorEl,
  onClose,
  anchorOriginH,
  transformOriginH,
  isSlotted,
  children,
  options,
  value,
  onToggle,
  searchable,
  searchPlaceholder,
}: PopoverDropdownProps) {
  const theme = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { placement, maxHeight } = useDropdownPlacement(anchorEl, { open });
  const isTop = placement === 'top';
  const inheritedMode = useInheritedColorMode(anchorEl, open);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset search whenever the dropdown closes so the next open shows all
  // options. Keeping the old query would feel stale.
  useEffect(() => {
    if (!open) setSearchQuery('');
  }, [open]);

  const filteredOptions = React.useMemo(() => {
    if (!searchable || searchQuery.trim() === '') return options;
    const needle = searchQuery.trim().toLowerCase();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(needle) ||
      (opt.badge?.label ?? '').toLowerCase().includes(needle),
    );
  }, [options, searchable, searchQuery]);

  // If any option carries a badge we render the custom row layout for every
  // option in this dropdown so labels stay aligned. Otherwise we fall through
  // to the legacy Checkbox-with-label rendering to preserve existing visuals.
  const hasBadgedOptions = options.some((opt) => Boolean(opt.badge));
  const useCustomRows = hasBadgedOptions || searchable;

  useEffect(() => {
    if (open && dropdownRef.current) dropdownRef.current.focus();
  }, [open]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: isTop ? 'top' : 'bottom', horizontal: anchorOriginH }}
      transformOrigin={{ vertical: isTop ? 'bottom' : 'top', horizontal: transformOriginH }}
      disablePortal={false}
      slotProps={{
        paper: getColorModePaperProps(inheritedMode, {
            borderRadius: theme.customBorderRadius.xl,
            overflow: 'visible',
            boxShadow: 'none',
            mt: isTop ? 0 : theme.customSpacing[1],
            mb: isTop ? theme.customSpacing[1] : 0,
            bgcolor: theme.semantic.common.white,
            backgroundImage: theme.surfaceOverlay.high,
        }),
      }}
    >
      <SmoothBox
        ref={dropdownRef}
        tabIndex={-1}
        smoothRadius={theme.customBorderRadius.xl}
        sx={{
          outline: 'none',
          bgcolor: theme.semantic.common.white,
          backgroundImage: theme.surfaceOverlay.high,
          boxShadow: theme.customShadows.lg,
          border: `1px solid ${theme.semantic.divider}`,
          minWidth: 'max-content',
          maxHeight,
          // Sectioned layout (searchable or badged): outer box is a flex
          // column that clips overflow; sections own their padding and the
          // options section owns the scroll. Legacy layout (no search, no
          // badges): keep the historical p:16 + overflow:auto on the outer
          // box so existing consumers render identically.
          ...(useCustomRows
            ? {
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                p: 0,
              }
            : {
                p: theme.customSpacing[4],
                overflowY: 'auto',
              }),
        }}
      >
        {isSlotted ? (
          children
        ) : useCustomRows ? (
          <>
            {searchable && (
              <DropdownSearchSection>
                <TextInputField
                  label="Search"
                  hideLabel
                  size="base"
                  placeholder={searchPlaceholder ?? 'Search...'}
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  startIcon={<SearchIcon size={20} color="currentColor" />}
                />
              </DropdownSearchSection>
            )}
            <DropdownOptionsSection
              role="listbox"
              aria-multiselectable="true"
            >
              {filteredOptions.length === 0 ? (
                <DropdownEmptyMessage>No matching options.</DropdownEmptyMessage>
              ) : (
                filteredOptions.map((opt) => {
                  const isChecked = value.includes(opt.value);
                  const badge = opt.badge;
                  return (
                    <DropdownOptionRow
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isChecked}
                      onClick={() => onToggle(opt.value)}
                    >
                      <Checkbox
                        checked={isChecked}
                        onChange={() => onToggle(opt.value)}
                      />
                      {badge && (
                        <Tooltip title={badge.tooltip ?? badge.label}>
                          <DropdownOptionBadge>{badge.label}</DropdownOptionBadge>
                        </Tooltip>
                      )}
                      <DropdownOptionLabel>
                        {opt.label}
                        {opt.secondaryLabel && (
                          <Box
                            component="span"
                            sx={{ color: theme.semantic.text.secondary, ml: theme.customSpacing[1] }}
                          >
                            ({opt.secondaryLabel})
                          </Box>
                        )}
                      </DropdownOptionLabel>
                    </DropdownOptionRow>
                  );
                })
              )}
            </DropdownOptionsSection>
          </>
        ) : (
          <OptionsListGap
            role="listbox"
            aria-multiselectable="true"
          >
            {filteredOptions.map((opt) => (
              <Checkbox
                key={opt.value}
                checked={value.includes(opt.value)}
                onChange={() => onToggle(opt.value)}
                label={opt.secondaryLabel ? (
                  <>
                    {opt.label}
                    <Box
                      component="span"
                      sx={{ color: theme.semantic.text.secondary, ml: theme.customSpacing[1] }}
                    >
                      ({opt.secondaryLabel})
                    </Box>
                  </>
                ) : opt.label}
              />
            ))}
          </OptionsListGap>
        )}
      </SmoothBox>
    </Popover>
  );
}

// Component

export default function MultiselectField({
  variant = 'default',
  size = 'base',
  label,
  hideLabel,
  placeholder = 'Select options',
  value = [],
  onChange,
  options = [],
  comboInput = false,
  dropdownAlign = 'left',
  tooltip,
  required = false,
  disabled = false,
  searchable = false,
  searchPlaceholder,
  children,
  sx,
  ...props
}: MultiselectFieldProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const hasValue = Array.isArray(value) && value.length > 0;
  const isBase = size === 'base';
  const isGhost = variant === 'ghost';

  // Trigger shows as many full labels as fit in the available width. When
  // the joined labels would overflow, show the ones that fit plus a "+N" pill
  // covering the remainder. Measurement is done against a hidden copy of the
  // labels so the live trigger never expands past its container.
  const selectedLabels = hasValue
    ? value.map((v) => options.find((o) => o.value === v)?.label ?? v)
    : [];
  const triggerRef = useRef<HTMLElement | null>(null);
  const measureRowRef = useRef<HTMLSpanElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(selectedLabels.length);
  const [resizeTick, setResizeTick] = useState(0);

  // Recompute when the trigger resizes (viewport change, flex parent reflow).
  useEffect(() => {
    const el = triggerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setResizeTick((t) => t + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!hasValue || !triggerRef.current || !measureRowRef.current) {
      setVisibleCount(selectedLabels.length);
      return;
    }
    // Reserve room for horizontal padding + chevron + gap.
    const RESERVED = 56;
    const available = triggerRef.current.clientWidth - RESERVED;
    const labelEls = Array.from(
      measureRowRef.current.querySelectorAll<HTMLElement>('[data-label]'),
    );
    const badgeEl = measureRowRef.current.querySelector<HTMLElement>('[data-badge]');
    const badgeW = badgeEl ? badgeEl.offsetWidth + 8 : 0;

    let used = 0;
    let count = 0;
    for (let i = 0; i < labelEls.length; i++) {
      const w = labelEls[i].offsetWidth;
      const next = used + w;
      // Only reserve badge width if at least one more label will overflow.
      const needed = i < labelEls.length - 1 ? next + badgeW : next;
      if (needed <= available) {
        used = next;
        count = i + 1;
      } else {
        break;
      }
    }
    // Always show at least the first label (trimmed by CSS ellipsis if the
    // single label is itself wider than the trigger).
    setVisibleCount(Math.max(1, count));
  }, [hasValue, selectedLabels, resizeTick]);

  const visibleLabels = selectedLabels.slice(0, visibleCount);
  const overflowCount = Math.max(0, selectedLabels.length - visibleLabels.length);
  const displayText = hasValue ? visibleLabels.join(', ') : placeholder;
  const isPlaceholder = !hasValue;

  const iconSize = isBase ? 20 : 16;

  const anchorOriginH: 'left' | 'right' = dropdownAlign === 'right' ? 'right' : 'left';
  const transformOriginH: 'left' | 'right' = dropdownAlign === 'right' ? 'right' : 'left';

  function handleOpen(e: React.MouseEvent) {
    if (disabled) return;
    e.preventDefault();
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleToggle(optValue: string) {
    if (!onChange) return;
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === 'Escape') setIsOpen(false);
  }

  // Ghost variant
  if (isGhost) {
    return (
      <GhostRoot sx={sx} {...props}>
        {label && !hideLabel && (
          <LabelRow isBase={isBase}>
            <LabelText isBase={isBase}>
              {label}
            </LabelText>
            {required && <RequiredAsterisk component="span" isBase={isBase}>*</RequiredAsterisk>}
            {tooltip && <IconTooltip title={tooltip} size={18} />}
          </LabelRow>
        )}

        <GhostAnchorWrap ref={anchorRef}>
          <GhostTriggerButton
            component="button"
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            isDisabled={disabled}
            isPlaceholder={isPlaceholder}
            isBase={isBase}
          >
            <GhostDisplayText component="span" isBase={isBase}>
              {displayText}
            </GhostDisplayText>
            {overflowCount > 0 && (
              <OverflowCountBadge aria-label={`${overflowCount} more selected`}>
                +{overflowCount}
              </OverflowCountBadge>
            )}
            <GhostChevronIcon component="span" isOpen={isOpen}>
              <ChevronDownIcon size={iconSize} color="currentColor" />
            </GhostChevronIcon>
          </GhostTriggerButton>
        </GhostAnchorWrap>

        <PopoverDropdown
          open={isOpen}
          anchorEl={anchorRef.current}
          onClose={handleClose}
          anchorOriginH={anchorOriginH}
          transformOriginH={transformOriginH}
          isSlotted={Boolean(children)}
          options={options}
          value={value}
          onToggle={handleToggle}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
        >
          {children}
        </PopoverDropdown>
      </GhostRoot>
    );
  }

  // Default variant
  return (
    <DefaultRoot data-annotation-target="MultiselectField" sx={sx} {...props}>
      {label && !hideLabel && (
        <LabelRow isBase={isBase}>
          <LabelText isBase={isBase}>
            {label}
          </LabelText>
          {required && <RequiredAsterisk component="span" isBase={isBase}>*</RequiredAsterisk>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </LabelRow>
      )}

      <Box ref={anchorRef}>
        {comboInput ? (
          <MultiSelectTrigger
            component="button"
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-disabled={disabled}
            isOpen={isOpen}
            isDisabled={disabled}
            isBase={isBase}
          >
            <TriggerDisplayText
              component="span"
              isPlaceholder={isPlaceholder}
              isBase={isBase}
            >
              {displayText}
            </TriggerDisplayText>

            <TriggerTrailingIcons component="span">
              {hasValue && (
                <SelectedCountText component="span" isBase={isBase}>
                  {value.length} selected
                </SelectedCountText>
              )}
              <MultiSelectChevron component="span" isOpen={isOpen}>
                <ChevronDownIcon size={iconSize} color="currentColor" />
              </MultiSelectChevron>
            </TriggerTrailingIcons>
          </MultiSelectTrigger>
        ) : (
          <MultiSelectTrigger
            component="button"
            ref={triggerRef as React.Ref<HTMLElement>}
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-disabled={disabled}
            isOpen={isOpen}
            isDisabled={disabled}
            isBase={isBase}
            sx={{ position: 'relative' }}
          >
            <TriggerDisplayText
              component="span"
              isPlaceholder={isPlaceholder}
              isBase={isBase}
            >
              {displayText}
            </TriggerDisplayText>

            {overflowCount > 0 && (
              <OverflowCountBadge aria-label={`${overflowCount} more selected`}>
                +{overflowCount}
              </OverflowCountBadge>
            )}

            <MultiSelectChevron component="span" isOpen={isOpen}>
              <ChevronDownIcon size={iconSize} color="currentColor" />
            </MultiSelectChevron>

            {tooltip && (!label || hideLabel) && (
              <InlineTooltipWrap component="span">
                <IconTooltip title={tooltip} size={iconSize} />
              </InlineTooltipWrap>
            )}

            {/* Off-screen measurement copy; lets us figure out how many
                labels fit without affecting the live trigger layout. */}
            {hasValue && (
              <HiddenMeasureRow ref={measureRowRef} aria-hidden="true">
                {selectedLabels.map((lbl, i) => (
                  <span key={i} data-label>
                    {i === 0 ? lbl : `, ${lbl}`}
                  </span>
                ))}
                <OverflowCountBadge data-badge>+{selectedLabels.length}</OverflowCountBadge>
              </HiddenMeasureRow>
            )}
          </MultiSelectTrigger>
        )}
      </Box>

      <PopoverDropdown
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOriginH={anchorOriginH}
        transformOriginH={transformOriginH}
        isSlotted={Boolean(children)}
        options={options}
        value={value}
        onToggle={handleToggle}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
      >
        {children}
      </PopoverDropdown>
    </DefaultRoot>
  );
}
