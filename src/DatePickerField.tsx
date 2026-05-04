'use client';

/**
 * DatePickerField — SV Design System date picker (single date or date range).
 *
 * Props:
 *   variant      "single" | "range"                    default: "single"
 *   value        Date | [Date|null, Date|null] | null   controlled value
 *   onChange     (value: Date | [Date, Date]) => void
 *   label        string                                 optional label above trigger
 *   helperText   string                                 optional helper text below trigger
 *   error        bool | string                          error state / message
 *   disabled     bool                                   default: false
 *   minDate      Date                                   optional minimum selectable date
 *   maxDate      Date                                   optional maximum selectable date
 *   placeholder  string                                 optional placeholder text
 *   dateFormat   string                                 default: 'MMM d, yyyy'
 *   tooltip      string                                 shows <IconTooltip> after label text
 *   errorIcon    ReactNode                              icon in error row (default <WarningOutlineIcon />)
 *   sx           MUI sx prop                            extra styles on outer Box
 */

import React, { useState, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import SmoothBox from './SmoothBox';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import { useDropdownPlacement } from './useDropdownPlacement';
import { useInheritedColorMode } from './useInheritedColorMode';
import {
  CalendarIcon,
  CaretDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  WarningOutlineIcon,
} from './icons';
import {
  DatePickerLabelRow,
  DatePickerLabelText,
  DatePickerRequiredMark,
  DatePickerTrigger,
  DatePickerTriggerText,
  DatePickerHelperText,
  DatePickerErrorRow,
  DatePickerErrorText,
  DatePickerOuterBox,
  TriggerCalendarIconWrap,
  CalendarContainer,
  CalendarHeaderRow,
  MonthYearButton,
  MonthYearLabel,
  NavButtonGroup,
  NavButton,
  YearGrid,
  YearCell,
  DowHeaderGrid,
  DowCell,
  DowLabel,
  DayGrid,
  EmptyDayCell,
  DayText,
} from './DatePickerField.styles';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  isAfter,
  addMonths,
  getDay,
  isSameYear,
} from 'date-fns';

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

export type DatePickerVariant = 'single' | 'range';
export type DatePickerValue = Date | [Date | null, Date | null] | null;

export interface DatePickerFieldProps {
  variant?: DatePickerVariant;
  value?: DatePickerValue;
  onChange?: (value: Date | [Date, Date | null]) => void;
  label?: string;
  hideLabel?: boolean;
  helperText?: string;
  error?: boolean | string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  dateFormat?: string;
  tooltip?: string;
  errorIcon?: React.ReactNode;
  required?: boolean;
  size?: 'base' | 'small';
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

// Display text formatting

interface FormatDisplayTextArgs {
  variant: DatePickerVariant;
  value: DatePickerValue;
  placeholder?: string;
  dateFormat: string;
}

function formatDisplayText({ variant, value, placeholder, dateFormat }: FormatDisplayTextArgs) {
  const fmt = dateFormat ?? 'MMM d, yyyy';

  if (variant === 'range') {
    const [start, end] = Array.isArray(value) ? value : [null, null];
    if (!start && !end) return { text: placeholder ?? 'Select date range', isPlaceholder: true };
    if (start && !end) return { text: `${format(start, fmt)} – ...`, isPlaceholder: false };
    if (start && end) {
      if (isSameYear(start, end)) {
        return { text: `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`, isPlaceholder: false };
      }
      return { text: `${format(start, fmt)} – ${format(end, fmt)}`, isPlaceholder: false };
    }
  }

  if (!value) return { text: placeholder ?? 'Select date', isPlaceholder: true };
  return { text: format(value as Date, fmt), isPlaceholder: false };
}

// Calendar sub-component

const DOW_LABELS = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

interface DayStateArgs {
  day: Date;
  value: DatePickerValue;
  variant: DatePickerVariant;
  pendingStart: Date | null;
  hoverDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
  today: Date;
}

interface DayState {
  isDisabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isRangeMiddle: boolean;
}

function getDayState({
  day,
  value,
  variant,
  pendingStart,
  hoverDate,
  minDate,
  maxDate,
  today,
}: DayStateArgs): DayState {
  const isDisabled =
    Boolean(minDate && isBefore(day, minDate) && !isSameDay(day, minDate)) ||
    Boolean(maxDate && isAfter(day, maxDate) && !isSameDay(day, maxDate));

  const isToday = isSameDay(day, today);

  if (variant === 'single') {
    const isSelected = value instanceof Date && isSameDay(day, value);
    return { isDisabled, isToday, isSelected, isRangeStart: false, isRangeEnd: false, isRangeMiddle: false };
  }

  const [rangeStart, rangeEnd] = Array.isArray(value) ? value : [null, null];

  let effectiveStart = rangeStart;
  let effectiveEnd = rangeEnd;

  if (pendingStart && !rangeEnd && hoverDate) {
    if (isBefore(hoverDate, pendingStart)) {
      effectiveStart = hoverDate;
      effectiveEnd = pendingStart;
    } else {
      effectiveStart = pendingStart;
      effectiveEnd = hoverDate;
    }
  }

  const isStart = Boolean(effectiveStart && isSameDay(day, effectiveStart));
  const isEnd = Boolean(effectiveEnd && isSameDay(day, effectiveEnd));
  const isBetween =
    Boolean(effectiveStart) &&
    Boolean(effectiveEnd) &&
    isAfter(day, effectiveStart as Date) &&
    isBefore(day, effectiveEnd as Date);

  if (isStart && isEnd) {
    return { isDisabled, isToday, isSelected: true, isRangeStart: false, isRangeEnd: false, isRangeMiddle: false };
  }

  return {
    isDisabled,
    isToday,
    isSelected: false,
    isRangeStart: isStart && !isEnd,
    isRangeEnd: isEnd && !isStart,
    isRangeMiddle: isBetween,
  };
}

function getDayCellSx(state: DayState, theme: Theme) {
  const { isDisabled, isToday, isSelected, isRangeStart, isRangeEnd, isRangeMiddle } = state;

  const base = {
    width: theme.customSpacing[8],
    height: theme.customSpacing[8],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    userSelect: 'none',
    flexShrink: 0,
  };

  if (isSelected) {
    return { ...base, bgcolor: theme.semantic.primary.main, borderRadius: theme.customBorderRadius.default, color: theme.semantic.common.white };
  }
  if (isRangeStart) {
    return {
      ...base,
      bgcolor: theme.semantic.primary.main,
      borderTopLeftRadius: theme.customBorderRadius.default,
      borderBottomLeftRadius: theme.customBorderRadius.default,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      color: theme.semantic.common.white,
    };
  }
  if (isRangeEnd) {
    return {
      ...base,
      bgcolor: theme.semantic.primary.main,
      borderTopRightRadius: theme.customBorderRadius.default,
      borderBottomRightRadius: theme.customBorderRadius.default,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      color: theme.semantic.common.white,
    };
  }
  if (isRangeMiddle) {
    return { ...base, bgcolor: theme.semantic.primary.swatch, borderRadius: 0, color: theme.semantic.primary.main };
  }
  if (isDisabled) {
    return { ...base, color: theme.semantic.text.secondary, borderRadius: theme.customBorderRadius.default };
  }

  return {
    ...base,
    borderRadius: theme.customBorderRadius.default,
    border: isToday ? `1px solid ${theme.semantic.divider}` : 'none',
    color: theme.semantic.text.primary,
    '&:hover': {
      bgcolor: theme.semantic.primary.swatch,
      color: theme.semantic.primary.dark,
    },
  };
}

// Re-export CalendarPanel as Calendar for backward compatibility
export { default as Calendar } from './CalendarPanel';
export type { CalendarPanelProps as CalendarProps } from './CalendarPanel';

// Internal Calendar used by the DatePickerField dropdown
interface InternalCalendarProps {
  variant: DatePickerVariant;
  value: DatePickerValue;
  onChange?: (value: Date | [Date, Date | null]) => void;
  minDate?: Date;
  maxDate?: Date;
  onClose?: () => void;
}

function InternalCalendar({ variant, value, onChange, minDate, maxDate, onClose }: InternalCalendarProps) {
  const theme = useTheme();

  if (process.env.NODE_ENV !== 'production' && minDate && maxDate && isAfter(minDate, maxDate)) {
    console.warn('[DatePickerField] minDate is after maxDate — all days will be disabled.');
  }

  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => {
    if (variant === 'range' && Array.isArray(value) && value[0]) return value[0];
    if (value instanceof Date) return value;
    return today;
  });
  const [showYears, setShowYears] = useState(false);
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = getDay(monthStart);

  const effectivePendingStart = pendingStart;

  function handleDayClick(day: Date) {
    if (
      (minDate && isBefore(day, minDate) && !isSameDay(day, minDate)) ||
      (maxDate && isAfter(day, maxDate) && !isSameDay(day, maxDate))
    ) {
      return;
    }

    if (variant === 'single') {
      onChange?.(day);
      onClose?.();
      return;
    }

    if (!pendingStart) {
      setPendingStart(day);
      onChange?.([day, null]);
    } else {
      let lo = pendingStart;
      let hi = day;
      if (isBefore(hi, lo)) [lo, hi] = [hi, lo];
      setPendingStart(null);
      setHoverDate(null);
      onChange?.([lo, hi]);
      onClose?.();
    }
  }

  const currentYear = viewDate.getFullYear();
  const yearRange = Array.from({ length: 13 }, (_, i) => currentYear - 6 + i);

  // Year grid view
  if (showYears) {
    return (
      <CalendarContainer>
        <CalendarHeaderRow>
          <MonthYearButton
            component="button"
            onClick={() => setShowYears(false)}
            aria-label="Close year picker"
            aria-expanded={showYears}
          >
            <MonthYearLabel>
              {format(viewDate, 'MMMM yyyy')}
            </MonthYearLabel>
            <CaretDownIcon size={12} color={theme.semantic.text.secondary} />
          </MonthYearButton>
        </CalendarHeaderRow>

        <YearGrid>
          {yearRange.map((year) => {
            const isSelectedYear = year === currentYear;
            return (
              <YearCell
                key={year}
                component="button"
                isSelectedYear={isSelectedYear}
                onClick={() => {
                  setViewDate(new Date(year, viewDate.getMonth(), 1));
                  setShowYears(false);
                }}
              >
                {year}
              </YearCell>
            );
          })}
        </YearGrid>
      </CalendarContainer>
    );
  }

  // Day grid view
  return (
    <CalendarContainer>
      <CalendarHeaderRow>
        <MonthYearButton
          component="button"
          onClick={() => setShowYears(true)}
          aria-label="Open year picker"
          aria-expanded={showYears}
        >
          <MonthYearLabel>
            {format(viewDate, 'MMMM yyyy')}
          </MonthYearLabel>
          <CaretDownIcon size={12} color={theme.semantic.text.secondary} />
        </MonthYearButton>

        <NavButtonGroup>
          <NavButton
            component="button"
            onClick={() => setViewDate((d) => addMonths(d, -1))}
            aria-label="Previous month"
          >
            <ChevronLeftIcon size={16} color={theme.semantic.text.secondary} />
          </NavButton>
          <NavButton
            component="button"
            onClick={() => setViewDate((d) => addMonths(d, 1))}
            aria-label="Next month"
          >
            <ChevronRightIcon size={16} color={theme.semantic.text.secondary} />
          </NavButton>
        </NavButtonGroup>
      </CalendarHeaderRow>

      {/* Day-of-week header */}
      <DowHeaderGrid>
        {DOW_LABELS.map((lbl) => (
          <DowCell key={lbl}>
            <DowLabel>{lbl}</DowLabel>
          </DowCell>
        ))}
      </DowHeaderGrid>

      {/* Day grid */}
      <DayGrid
        role="grid"
        onMouseLeave={() => setHoverDate(null)}
      >
        {Array.from({ length: startOffset }).map((_, i) => (
          <EmptyDayCell key={`empty-${i}`} />
        ))}

        {daysInMonth.map((day) => {
          const state = getDayState({ day, value, variant, pendingStart: effectivePendingStart, hoverDate, minDate, maxDate, today });
          const cellSx = getDayCellSx(state, theme);

          return (
            <Box
              key={day.toISOString()}
              role="button"
              tabIndex={state.isDisabled ? -1 : 0}
              aria-label={format(day, 'MMMM d, yyyy')}
              aria-disabled={state.isDisabled}
              onClick={() => !state.isDisabled && handleDayClick(day)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if ((e.key === 'Enter' || e.key === ' ') && !state.isDisabled) {
                  e.preventDefault();
                  handleDayClick(day);
                }
              }}
              onMouseEnter={() => {
                if (effectivePendingStart && !state.isDisabled) setHoverDate(day);
              }}
              sx={cellSx}
            >
              <DayText component="span">
                {format(day, 'd')}
              </DayText>
            </Box>
          );
        })}
      </DayGrid>
    </CalendarContainer>
  );
}

// DatePickerField component

export default function DatePickerField({
  variant = 'single',
  value = null,
  onChange,
  label,
  hideLabel,
  helperText,
  error = false,
  disabled = false,
  minDate,
  maxDate,
  placeholder,
  dateFormat = 'MMM d, yyyy',
  tooltip,
  errorIcon,
  required = false,
  size = 'base',
  sx,
  ...props
}: DatePickerFieldProps) {
  const theme = useTheme();
  const isSmall = size === 'small';
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  // Calendar popover is ~360px tall — reserve that plus padding before flipping.
  const { placement: dpPlacement } = useDropdownPlacement(anchorRef.current, {
    open: isOpen,
    minSpace: 380,
  });
  const isDpTop = dpPlacement === 'top';
  const inheritedMode = useInheritedColorMode(anchorRef.current, isOpen);

  const isError = Boolean(error && !disabled);
  const errorMessage = typeof error === 'string' ? error : 'Invalid date';

  const { text: displayText, isPlaceholder } = formatDisplayText({ variant, value, placeholder, dateFormat });

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

  return (
    <DatePickerOuterBox data-annotation-target="DatePickerField" sx={sx} {...props}>
      {label && !hideLabel && (
        <DatePickerLabelRow>
          <DatePickerLabelText>{label}</DatePickerLabelText>
          {required && <DatePickerRequiredMark component="span">*</DatePickerRequiredMark>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </DatePickerLabelRow>
      )}

      <Box ref={anchorRef}>
        <DatePickerTrigger
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          isError={isError}
          isOpen={isOpen}
          isDisabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={[label, displayText].filter(Boolean).join(', ')}
          sx={isSmall ? {
            height: theme.inputHeights.small,
            borderRadius: theme.customBorderRadius.lg,
            paddingTop: theme.customSpacing[2],
            paddingBottom: theme.customSpacing[2],
          } : undefined}
        >
          <DatePickerTriggerText
            isPlaceholder={isPlaceholder}
            sx={isSmall ? { ...theme.customTypography.body2.regular } : undefined}
          >
            {displayText}
          </DatePickerTriggerText>
          <TriggerCalendarIconWrap component="span">
            <CalendarIcon size={16} color={theme.semantic.text.secondary} />
          </TriggerCalendarIconWrap>
        </DatePickerTrigger>
      </Box>

      {helperText && !isError && (
        <DatePickerHelperText>{helperText}</DatePickerHelperText>
      )}

      {isError && (
        <DatePickerErrorRow>
          {errorIcon ?? <WarningOutlineIcon size={16} color={theme.semantic.error.main} />}
          <DatePickerErrorText>{errorMessage}</DatePickerErrorText>
        </DatePickerErrorRow>
      )}

      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: isDpTop ? 'top' : 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: isDpTop ? 'bottom' : 'top', horizontal: 'left' }}
        disablePortal={false}
        slotProps={{
          paper: getColorModePaperProps(inheritedMode, {
              borderRadius: theme.customBorderRadius.xl,
              overflow: 'visible',
              boxShadow: 'none',
              mt: isDpTop ? 0 : theme.customSpacing[1],
              mb: isDpTop ? theme.customSpacing[1] : 0,
              bgcolor: theme.semantic.common.white,
              backgroundImage: theme.surfaceOverlay.high,
          }),
        }}
      >
        <SmoothBox
          role="dialog"
          aria-label="Date picker"
          tabIndex={-1}
          smoothRadius={theme.customBorderRadius.xl}
          sx={{
            bgcolor: theme.semantic.common.white,
            backgroundImage: theme.surfaceOverlay.high,
            boxShadow: theme.customShadows.md,
            border: `1px solid ${theme.semantic.divider}`,
            p: theme.customSpacing[4],
            minWidth: 'max-content',
            outline: 'none',
          }}
        >
          <InternalCalendar
            variant={variant}
            value={value}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            onClose={handleClose}
          />
        </SmoothBox>
      </Popover>
    </DatePickerOuterBox>
  );
}
