'use client';

/**
 * TagField - SV Design System
 * Source: Figma file OVjygxh5hpVujmD1gl4MB9, node 1176-2047
 *
 * A text input where pressing Enter converts typed text into a removable
 * Chip tag. Controlled: parent manages the tag list via values/onChange.
 *
 * Props:
 *   label        - string    - label above field (omit to hide)
 *   tooltip      - string    - <IconTooltip> after label (requires label)
 *   values       - string[]  - controlled list of current tags
 *   onChange     - func      - (values: string[]) => void
 *   placeholder  - string    - input placeholder (default: 'Add a tag...')
 *   variant      - 'inline' | 'wrap' | 'dropdown'  default: 'inline'
 *                    inline   - collapses to one row when blurred, expands in-flow
 *                               to multiple rows when focused; +N overflow badge
 *                    wrap     - always shows all chips; never collapses
 *                    dropdown - same collapse behavior as inline, but the expanded
 *                               focused state detaches from layout flow and floats
 *                               as an absolute overlay so adjacent fields don't
 *                               shift when chips spill onto additional rows
 *   error        - string    - error message; triggers error border
 *   errorIcon    - ReactNode - icon in error row (default <WarningOutlineIcon />)
 *   disabled     - bool      - default: false
 *   readOnly     - bool      - shows chips without remove buttons or text input
 *   sx           - SxProps   - overrides on outer wrapper Box
 */

import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import Tooltip from './Tooltip';
import Chip from './Chip';
import { WarningOutlineIcon } from './icons';
import {
  TagFieldWrapper,
  TagFieldLabelRow,
  TagFieldLabelText,
  TagFieldRequiredMark,
  TagInputBox,
  TagInput,
  TagFieldErrorRow,
  TagFieldErrorText,
  TagOverflowWrap,
  TooltipColumn,
  TooltipValueText,
  TagFieldContainerBox,
  TagFieldInputBase,
  TagFieldPlaceholderText,
  TagFieldMeasureRow,
  TagFieldMeasureChip,
  TagFieldMeasureBadge,
  TagFieldDropdownSpacer,
} from './TagField.styles';

export interface TagFieldProps {
  label?: string;
  hideLabel?: boolean;
  tooltip?: string;
  required?: boolean;
  values?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  variant?: 'inline' | 'wrap' | 'dropdown';
  error?: string;
  errorIcon?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'base' | 'small';
  sx?: SxProps<Theme>;
}

function OverflowBadge({ count, allValues, size = 'small' }: { count: number; allValues: string[]; size?: 'base' | 'small' }) {
  return (
    <Tooltip
      title={
        <TooltipColumn>
          {allValues.map((v) => (
            <TooltipValueText key={v}>{v}</TooltipValueText>
          ))}
        </TooltipColumn>
      }
    >
      <TagOverflowWrap component="span" isSmall={size === 'small'}>
        <Chip label={`+${count}`} size={size} style="duotone" color="default" />
      </TagOverflowWrap>
    </Tooltip>
  );
}

export default function TagField({
  label,
  hideLabel,
  tooltip,
  required = false,
  values = [],
  onChange,
  placeholder = 'Add a tag...',
  variant = 'inline',
  error,
  errorIcon,
  disabled = false,
  readOnly = false,
  size = 'base',
  sx,
}: TagFieldProps) {
  const theme = useTheme();
  const isSmall = size === 'small';
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(values.length);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const isError = Boolean(error && !disabled);
  // Both 'inline' and 'dropdown' variants collapse to a single-row preview
  // when blurred. The difference shows up on focus: 'inline' expands in the
  // layout flow (pushes siblings down); 'dropdown' detaches and floats as
  // an absolute overlay so siblings keep their positions.
  const isCollapsible = variant === 'inline' || variant === 'dropdown';
  const isCollapsed = isCollapsible && !isFocused;
  const isOverlay = variant === 'dropdown' && isFocused;

  // Recalculate overflow when container resizes
  const [resizeTick, setResizeTick] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setResizeTick((t) => t + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    // Keep visibleCount in sync with "how many chips fit in the collapsed
    // row" at ALL times when the variant can collapse, not just when
    // currently collapsed. Previously we recalculated only on the blur
    // transition, which caused a one-frame glitch: the first render after
    // blur still had `visibleCount = values.length` (set while focused),
    // so every chip briefly rendered in the now-in-flow nowrap row. Its
    // intrinsic min-content width pushed the parent grid cell wider before
    // the effect could reduce the count. Calculating continuously means
    // blur renders already-correct chips and no layout shift occurs.
    if (!isCollapsible) {
      setVisibleCount(values.length);
      return;
    }
    if (!containerRef.current || !measureRef.current) return;
    const availableWidth = containerRef.current.clientWidth - 28;
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
  }, [isCollapsible, values, resizeTick]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !values.includes(trimmed)) onChange?.([...values, trimmed]);
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && values.length > 0) {
      onChange?.(values.slice(0, -1));
    } else if (e.key === 'Escape') {
      setInputValue('');
    }
  };

  const handleRemove = useCallback(
    (index: number) => onChange?.(values.filter((_, i) => i !== index)),
    [values, onChange]
  );

  const focusInput = () => { if (!disabled && !readOnly) inputRef.current?.focus(); };

  const chipsToShow = isCollapsed ? values.slice(0, visibleCount) : values;
  const hiddenCount = values.length - visibleCount;

  return (
    <TagFieldWrapper data-annotation-target="TagField" sx={sx}>
      {label && !hideLabel && (
        <TagFieldLabelRow>
          <TagFieldLabelText>{label}</TagFieldLabelText>
          {required && <TagFieldRequiredMark component="span">*</TagFieldRequiredMark>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </TagFieldLabelRow>
      )}

      <TagFieldContainerBox ref={containerRef}>
        {/* Spacer holds the original single-row slot in the flow while the
            dropdown overlay is open, so sibling fields don't shift. */}
        {isOverlay && <TagFieldDropdownSpacer isSmall={isSmall} />}
        <TagInputBox
          onClick={focusInput}
          // Keep focus on the input when the user clicks somewhere inside
          // the overlay (e.g. a chip remove button). Without this, the natural
          // mousedown -> blur -> unmount sequence would dismiss the overlay
          // before the X click actually fires. Outside clicks still blur
          // normally because mouseDown there isn't prevented.
          onMouseDown={(e: React.MouseEvent) => {
            if (!isOverlay) return;
            if (e.target !== inputRef.current) e.preventDefault();
          }}
          isError={isError}
          isFocused={isFocused}
          isDisabled={disabled}
          isSmall={isSmall}
          isCollapsed={isCollapsed}
          isOverlay={isOverlay}
        >
          {chipsToShow.map((val, i) => (
            <Chip
              key={val}
              label={val}
              size={isSmall ? 'small' : 'base'}
              onRemove={!readOnly && !disabled ? () => handleRemove(i) : undefined}
              noTruncate
            />
          ))}

          {isCollapsed && hiddenCount > 0 && <OverflowBadge count={hiddenCount} allValues={values} size={isSmall ? 'small' : 'base'} />}

          {!readOnly && (
            <TagFieldInputBase
              inputRef={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={!isCollapsed && values.length === 0 ? placeholder : ''}
              disabled={disabled}
              isSmall={isSmall}
              isCollapsed={isCollapsed}
            />
          )}

          {isCollapsed && values.length === 0 && !readOnly && (
            <TagFieldPlaceholderText isSmall={isSmall}>
              {placeholder}
            </TagFieldPlaceholderText>
          )}
        </TagInputBox>

        {isCollapsible && (
          // Always render the measure row when the variant can collapse, so
          // visibleCount stays fresh even while focused/overlay is open.
          // This primes the collapsed chip count so blur has no reflow work
          // left to do, eliminating the one-frame width-glitch on blur.
          <TagFieldMeasureRow ref={measureRef} aria-hidden="true">
            {values.map((val) => (
              <TagFieldMeasureChip key={val} data-chip>
                <Chip label={val} size={isSmall ? 'small' : 'base'} onRemove={() => {}} />
              </TagFieldMeasureChip>
            ))}
            <TagFieldMeasureBadge data-badge isSmall={isSmall}>
              <Chip label="+99" size={isSmall ? 'small' : 'base'} style="duotone" color="default" />
            </TagFieldMeasureBadge>
          </TagFieldMeasureRow>
        )}
      </TagFieldContainerBox>

      {isError && (
        <TagFieldErrorRow>
          {errorIcon ?? <WarningOutlineIcon size={20} color={theme.semantic.error.main} />}
          <TagFieldErrorText>{error}</TagFieldErrorText>
        </TagFieldErrorRow>
      )}
    </TagFieldWrapper>
  );
}
