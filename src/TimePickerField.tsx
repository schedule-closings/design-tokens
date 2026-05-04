'use client';

/**
 * TimePickerField — SV Design System time picker.
 *
 * A trigger input that opens a Popover containing three scrollable columns
 * (Hour | Minute | AM-PM). Mirrors DatePickerField's shell so date/time
 * fields stack cleanly and share the same visual language.
 *
 * Canonical value format is `"HH:MM"` in 24-hour clock (e.g. `"08:00"`,
 * `"17:30"`). The `format` prop controls display only — the picker always
 * emits 24-hour strings so consumers can format them however they want
 * without round-trip ambiguity.
 *
 * Props:
 *   value         string | null   canonical "HH:MM" 24h string
 *   onChange      (v: string) => void  emits "HH:MM" 24h
 *   format        "12h" | "24h"   default "12h"  — display format
 *   minuteStep    number          default 15  — must divide 60
 *   minTime       string          optional "HH:MM" — inclusive lower bound
 *   maxTime       string          optional "HH:MM" — inclusive upper bound
 *   label         string          optional label above trigger
 *   hideLabel     boolean         render without the label row
 *   helperText    string          optional helper below trigger
 *   error         boolean|string  error state / message
 *   disabled      boolean         default false
 *   placeholder   string          default "Select time"
 *   tooltip       string          shows <IconTooltip> after label text
 *   errorIcon     ReactNode       icon in error row (default WarningOutlineIcon)
 *   required      boolean         shows red asterisk on label
 *   size          "base" | "small" default "base"
 *   variant       "default" | "ghost"  default "default"
 *   sx            MUI sx prop     extra styles on outer Box
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import SmoothBox from './SmoothBox';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import { useDropdownPlacement } from './useDropdownPlacement';
import { useInheritedColorMode } from './useInheritedColorMode';
import { CaretDownIcon, WarningOutlineIcon } from './icons';
import {
  TimePickerOuterBox,
  TimePickerLabelRow,
  TimePickerLabelText,
  TimePickerRequiredMark,
  TimePickerTrigger,
  TimePickerTriggerText,
  TimePickerChevronWrap,
  TimePickerHelperText,
  TimePickerErrorRow,
  TimePickerErrorText,
  TimePanelColumns,
  TimeColumn,
  TimeCell,
  TimeColumnDivider,
} from './TimePickerField.styles';

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

export type TimePickerFormat = '12h' | '24h';
export type TimePickerSize = 'base' | 'small';
export type TimePickerVariant = 'default' | 'ghost';

export interface TimePickerFieldProps {
  value?: string | null;
  onChange?: (value: string) => void;
  format?: TimePickerFormat;
  minuteStep?: number;
  minTime?: string;
  maxTime?: string;
  label?: string;
  hideLabel?: boolean;
  helperText?: string;
  error?: boolean | string;
  disabled?: boolean;
  placeholder?: string;
  tooltip?: string;
  errorIcon?: React.ReactNode;
  required?: boolean;
  size?: TimePickerSize;
  variant?: TimePickerVariant;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

// ── Parsing / formatting helpers ─────────────────────────────────────────────

/**
 * Convert a canonical "HH:MM" 24h string into minutes-since-midnight. Returns
 * null for malformed input so the comparison helpers can safely treat it as
 * "no bound".
 */
function parseMinutes(value?: string | null): number | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function toCanonical(hour24: number, minute: number): string {
  const hh = String(hour24).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Render a canonical time for display. 12h drops the leading zero on the hour
 * and appends AM/PM; 24h keeps the literal value. Empty/invalid input
 * produces an empty string so the trigger falls back to the placeholder.
 */
function formatDisplay(value: string | null | undefined, format: TimePickerFormat): string {
  const mins = parseMinutes(value);
  if (mins == null) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const mm = String(m).padStart(2, '0');
  if (format === '24h') {
    return `${String(h).padStart(2, '0')}:${mm}`;
  }
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm} ${period}`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TimePickerField({
  value = null,
  onChange,
  format = '12h',
  minuteStep = 15,
  minTime,
  maxTime,
  label,
  hideLabel,
  helperText,
  error = false,
  disabled = false,
  placeholder = 'Select time',
  tooltip,
  errorIcon,
  required = false,
  size = 'base',
  variant = 'default',
  sx,
  ...props
}: TimePickerFieldProps) {
  const theme = useTheme();
  const isSmall = size === 'small';
  const isGhost = variant === 'ghost';
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Popover is ~220px tall + padding — reserve ~260px before flipping up.
  const { placement: tpPlacement } = useDropdownPlacement(anchorRef.current, {
    open: isOpen,
    minSpace: 260,
  });
  const isTpTop = tpPlacement === 'top';
  const inheritedMode = useInheritedColorMode(anchorRef.current, isOpen);

  const isError = Boolean(error && !disabled);
  const errorMessage = typeof error === 'string' ? error : 'Invalid time';

  // Parse value + bounds once per render for fast disabled-cell lookups.
  const minMinutes = useMemo(() => parseMinutes(minTime), [minTime]);
  const maxMinutes = useMemo(() => parseMinutes(maxTime), [maxTime]);
  const selectedMinutes = useMemo(() => parseMinutes(value), [value]);

  const displayText = formatDisplay(value, format);
  const isPlaceholder = displayText === '';

  // Derive current hour/minute/period from the selected value. When nothing
  // is selected, show a sensible default so the columns don't render blank.
  // The default (9:00 AM) is picked because clicking "Select time" then
  // clicking a column cell should produce a committed value immediately.
  const currentHour24 = selectedMinutes != null ? Math.floor(selectedMinutes / 60) : 9;
  const currentMinute = selectedMinutes != null ? selectedMinutes % 60 : 0;
  const currentPeriod: 'AM' | 'PM' = currentHour24 >= 12 ? 'PM' : 'AM';

  // ── Column option lists ────────────────────────────────────────────────
  const hourOptions = useMemo(() => {
    if (format === '24h') {
      return Array.from({ length: 24 }, (_, i) => ({ label: String(i).padStart(2, '0'), value: i }));
    }
    // 12h: render 12, 1, 2, ... 11 so "12" sits at the top of the column
    // (matches how most clocks/pickers visually lead with 12).
    return Array.from({ length: 12 }, (_, i) => {
      const display = i === 0 ? 12 : i;
      return { label: String(display), value: display };
    });
  }, [format]);

  const minuteOptions = useMemo(() => {
    const step = Math.max(1, Math.min(60, Math.floor(minuteStep || 15)));
    const options: { label: string; value: number }[] = [];
    for (let m = 0; m < 60; m += step) {
      options.push({ label: String(m).padStart(2, '0'), value: m });
    }
    return options;
  }, [minuteStep]);

  // ── Commit helper ──────────────────────────────────────────────────────
  /**
   * Emit a new 24h canonical value. Accepts partial updates (hour / minute /
   * period) and composes them with the current state so clicking any single
   * column updates just that dimension.
   */
  function commit(next: { hour24?: number; minute?: number; period?: 'AM' | 'PM' }) {
    if (disabled) return;
    const minute = next.minute ?? currentMinute;
    let hour24: number;
    if (next.hour24 != null) {
      hour24 = next.hour24;
    } else if (next.period != null && format === '12h') {
      // Period change in 12h mode: keep the displayed hour the same and
      // only swap the AM/PM half.
      const displayed = currentHour24 % 12; // 0 for 12am/12pm
      hour24 = next.period === 'PM' ? displayed + 12 : displayed;
      // 12 AM → 0, 12 PM → 12 (both correct with the modular math above)
    } else {
      hour24 = currentHour24;
    }
    // Guard against rounding surprises.
    hour24 = ((hour24 % 24) + 24) % 24;
    const candidate = hour24 * 60 + minute;
    if (minMinutes != null && candidate < minMinutes) return;
    if (maxMinutes != null && candidate > maxMinutes) return;
    onChange?.(toCanonical(hour24, minute));
  }

  function isHourDisabled(hourValue: number): boolean {
    if (minMinutes == null && maxMinutes == null) return false;
    // Check if ANY minute within this hour is valid — if not, disable it.
    const hour24 =
      format === '24h'
        ? hourValue
        : currentPeriod === 'PM'
          ? (hourValue % 12) + 12
          : hourValue % 12;
    for (const mo of minuteOptions) {
      const mins = hour24 * 60 + mo.value;
      const okMin = minMinutes == null || mins >= minMinutes;
      const okMax = maxMinutes == null || mins <= maxMinutes;
      if (okMin && okMax) return false;
    }
    return true;
  }

  function isMinuteDisabled(minuteValue: number): boolean {
    if (minMinutes == null && maxMinutes == null) return false;
    const mins = currentHour24 * 60 + minuteValue;
    if (minMinutes != null && mins < minMinutes) return true;
    if (maxMinutes != null && mins > maxMinutes) return true;
    return false;
  }

  function isPeriodDisabled(period: 'AM' | 'PM'): boolean {
    if (minMinutes == null && maxMinutes == null) return false;
    const start = period === 'AM' ? 0 : 12 * 60;
    const end = period === 'AM' ? 12 * 60 - 1 : 24 * 60 - 1;
    if (maxMinutes != null && start > maxMinutes) return true;
    if (minMinutes != null && end < minMinutes) return true;
    return false;
  }

  // Scroll the selected cell into view when the popover opens.
  const hourColRef = useRef<HTMLDivElement>(null);
  const minuteColRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    // Let the popover render first, then scroll selected cells into view.
    const timer = window.setTimeout(() => {
      hourColRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({
        block: 'center',
      });
      minuteColRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({
        block: 'center',
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  function handleOpen(e: React.MouseEvent) {
    if (disabled) return;
    e.preventDefault();
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === 'Escape') setIsOpen(false);
  }

  // Current hour value in the column's own coordinate system (1-12 in 12h, 0-23 in 24h)
  const selectedHourOption =
    format === '24h'
      ? currentHour24
      : currentHour24 % 12 === 0
        ? 12
        : currentHour24 % 12;

  return (
    <TimePickerOuterBox data-annotation-target="TimePickerField" sx={sx} {...props}>
      {label && !hideLabel && (
        <TimePickerLabelRow>
          <TimePickerLabelText>{label}</TimePickerLabelText>
          {required && <TimePickerRequiredMark component="span">*</TimePickerRequiredMark>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </TimePickerLabelRow>
      )}

      <Box ref={anchorRef}>
        <TimePickerTrigger
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          isError={isError}
          isOpen={isOpen}
          isDisabled={disabled}
          isGhost={isGhost}
          isSmall={isSmall}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={[label, displayText || placeholder].filter(Boolean).join(', ')}
        >
          <TimePickerTriggerText isPlaceholder={isPlaceholder} isSmall={isSmall}>
            {isPlaceholder ? placeholder : displayText}
          </TimePickerTriggerText>
          <TimePickerChevronWrap component="span">
            <CaretDownIcon size={16} color={theme.semantic.text.secondary} />
          </TimePickerChevronWrap>
        </TimePickerTrigger>
      </Box>

      {helperText && !isError && <TimePickerHelperText>{helperText}</TimePickerHelperText>}

      {isError && (
        <TimePickerErrorRow>
          {errorIcon ?? <WarningOutlineIcon size={16} color={theme.semantic.error.main} />}
          <TimePickerErrorText>{errorMessage}</TimePickerErrorText>
        </TimePickerErrorRow>
      )}

      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: isTpTop ? 'top' : 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: isTpTop ? 'bottom' : 'top', horizontal: 'left' }}
        disablePortal={false}
        slotProps={{
          paper: getColorModePaperProps(inheritedMode, {
              borderRadius: theme.customBorderRadius.xl,
              overflow: 'visible',
              boxShadow: 'none',
              mt: isTpTop ? 0 : theme.customSpacing[1],
              mb: isTpTop ? theme.customSpacing[1] : 0,
              bgcolor: theme.semantic.common.white,
              backgroundImage: theme.surfaceOverlay.high,
          }),
        }}
      >
        <SmoothBox
          role="dialog"
          aria-label="Time picker"
          tabIndex={-1}
          smoothRadius={theme.customBorderRadius.xl}
          sx={{
            bgcolor: theme.semantic.common.white,
            backgroundImage: theme.surfaceOverlay.high,
            boxShadow: theme.customShadows.md,
            border: `1px solid ${theme.semantic.divider}`,
            minWidth: 'max-content',
            outline: 'none',
          }}
        >
          <TimePanelColumns>
            {/* Hour column */}
            <TimeColumn ref={hourColRef} role="listbox" aria-label="Hour">
              {hourOptions.map((opt) => {
                const isSelected = opt.value === selectedHourOption;
                const disabled = isHourDisabled(opt.value);
                return (
                  <TimeCell
                    key={`h-${opt.value}`}
                    role="option"
                    aria-selected={isSelected}
                    data-selected={isSelected ? 'true' : undefined}
                    isSelected={isSelected}
                    isDisabled={disabled}
                    onClick={() => {
                      if (format === '24h') {
                        commit({ hour24: opt.value });
                        return;
                      }
                      // 12h: compose the real 24h hour from column value + AM/PM
                      const base = opt.value === 12 ? 0 : opt.value;
                      const hour24 = currentPeriod === 'PM' ? base + 12 : base;
                      commit({ hour24 });
                    }}
                  >
                    {opt.label}
                  </TimeCell>
                );
              })}
            </TimeColumn>

            <TimeColumnDivider />

            {/* Minute column */}
            <TimeColumn ref={minuteColRef} role="listbox" aria-label="Minute">
              {minuteOptions.map((opt) => {
                const isSelected = opt.value === currentMinute;
                const disabled = isMinuteDisabled(opt.value);
                return (
                  <TimeCell
                    key={`m-${opt.value}`}
                    role="option"
                    aria-selected={isSelected}
                    data-selected={isSelected ? 'true' : undefined}
                    isSelected={isSelected}
                    isDisabled={disabled}
                    onClick={() => commit({ minute: opt.value })}
                  >
                    {opt.label}
                  </TimeCell>
                );
              })}
            </TimeColumn>

            {/* AM/PM column (12h only) */}
            {format === '12h' && (
              <>
                <TimeColumnDivider />
                <TimeColumn role="listbox" aria-label="AM or PM">
                  {(['AM', 'PM'] as const).map((p) => {
                    const isSelected = p === currentPeriod;
                    const disabled = isPeriodDisabled(p);
                    return (
                      <TimeCell
                        key={`p-${p}`}
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected ? 'true' : undefined}
                        isSelected={isSelected}
                        isDisabled={disabled}
                        onClick={() => commit({ period: p })}
                      >
                        {p}
                      </TimeCell>
                    );
                  })}
                </TimeColumn>
              </>
            )}
          </TimePanelColumns>
        </SmoothBox>
      </Popover>
    </TimePickerOuterBox>
  );
}
