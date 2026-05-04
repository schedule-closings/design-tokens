'use client';

/**
 * CalendarPanel — Standalone calendar component
 *
 * A reusable calendar that can be embedded inline or inside any container.
 * Supports single date and date range selection. Uses body1 typography,
 * shows trailing/leading days from adjacent months, and has 8px cell gaps.
 *
 * Forked from the Calendar sub-component in DatePickerField, upgraded for
 * standalone use with larger typography and adjacent-month day rendering.
 */

import React, { useState, useMemo } from 'react';
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
  subDays,
  addDays,
} from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { CaretDownIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import {
  CalendarRoot,
  YearPickerHeader,
  YearPickerToggle,
  YearPickerTitleText,
  YearGrid,
  YearButton,
  MonthHeader,
  NavButton,
  MonthTitleButton,
  MonthTitleText,
  DowGrid,
  DowCell,
  DowLabel,
  DayGrid,
  DayCell,
  DayText,
} from './CalendarPanel.styles';

// Types

export type CalendarPanelVariant = 'single' | 'range';
export type CalendarPanelValue = Date | [Date | null, Date | null] | null;

/** Availability level for a calendar day */
export type DayAvailability = 'high' | 'low' | 'none';

export interface CalendarPanelProps {
  variant?: CalendarPanelVariant;
  value?: CalendarPanelValue;
  onChange?: (value: Date | [Date, Date | null]) => void;
  minDate?: Date;
  maxDate?: Date;
  onClose?: () => void;
  /** Map of ISO date key (YYYY-MM-DD) → availability level for coloring day cells */
  dayAvailability?: Record<string, DayAvailability>;
}

// Constants

const DOW_LABELS = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

// Day state helpers

interface DayState {
  isDisabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isRangeMiddle: boolean;
  isOutsideMonth: boolean;
  isWeekend: boolean;
  isPast: boolean;
  availability?: DayAvailability;
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
  monthStart,
  monthEnd,
  dayAvailability,
}: {
  day: Date;
  value: CalendarPanelValue;
  variant: CalendarPanelVariant;
  pendingStart: Date | null;
  hoverDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
  today: Date;
  monthStart: Date;
  monthEnd: Date;
  dayAvailability?: Record<string, DayAvailability>;
}): DayState {
  const isOutsideMonth = isBefore(day, monthStart) || isAfter(day, monthEnd);
  const isWeekend = getDay(day) === 0 || getDay(day) === 6;
  const isPast = isBefore(day, today) && !isSameDay(day, today);
  const isDisabled =
    isOutsideMonth ||
    Boolean(minDate && isBefore(day, minDate) && !isSameDay(day, minDate)) ||
    Boolean(maxDate && isAfter(day, maxDate) && !isSameDay(day, maxDate));

  const isToday = isSameDay(day, today);
  const dateKey = format(day, 'yyyy-MM-dd');
  const availability = dayAvailability?.[dateKey];

  if (variant === 'single') {
    const isSelected = value instanceof Date && isSameDay(day, value);
    return { isDisabled, isToday, isSelected, isRangeStart: false, isRangeEnd: false, isRangeMiddle: false, isOutsideMonth, isWeekend, isPast, availability };
  }

  // range
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
    return { isDisabled, isToday, isSelected: true, isRangeStart: false, isRangeEnd: false, isRangeMiddle: false, isOutsideMonth, isWeekend, isPast, availability };
  }

  return {
    isDisabled,
    isToday,
    isSelected: false,
    isRangeStart: isStart && !isEnd,
    isRangeEnd: isEnd && !isStart,
    isRangeMiddle: isBetween,
    isOutsideMonth,
    isWeekend,
    isPast,
    availability,
  };
}

// Component

export default function CalendarPanel({
  variant = 'single',
  value = null,
  onChange,
  minDate,
  maxDate,
  onClose,
  dayAvailability,
}: CalendarPanelProps) {
  const theme = useTheme();
  const CELL_SIZE = theme.customSpacing[9]; // 36px — accommodates body1 + 8px gap
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

  // Leading days from previous month
  const leadingDays = startOffset > 0
    ? Array.from({ length: startOffset }, (_, i) => subDays(monthStart, startOffset - i))
    : [];

  // Trailing days to fill the last row (total cells = multiple of 7)
  const totalCells = leadingDays.length + daysInMonth.length;
  const trailingCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const trailingDays = Array.from({ length: trailingCount }, (_, i) => addDays(monthEnd, i + 1));

  const allDays = [...leadingDays, ...daysInMonth, ...trailingDays];

  // CSS custom properties for grid sizing
  const gridVars = {
    '--cal-cell-size': CELL_SIZE,
    '--cal-grid-cols': `repeat(7, ${CELL_SIZE})`,
  } as React.CSSProperties;

  function handleDayClick(day: Date) {
    // Don't allow clicking outside-month days
    if (isBefore(day, monthStart) || isAfter(day, monthEnd)) return;
    if (
      (minDate && isBefore(day, minDate) && !isSameDay(day, minDate)) ||
      (maxDate && isAfter(day, maxDate) && !isSameDay(day, maxDate))
    ) return;

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

  const handlePrevMonth = () => setViewDate((d) => addMonths(d, -1));
  const handleNextMonth = () => setViewDate((d) => addMonths(d, 1));

  // Year grid: ±10 years
  const currentYear = viewDate.getFullYear();
  const yearRange = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Render
  return (
    <CalendarRoot style={gridVars}>
    {showYears ? (
      <>
        <YearPickerHeader>
          <YearPickerToggle
            onClick={() => setShowYears(false)}
            aria-label="Close year picker"
          >
            <YearPickerTitleText>
              {format(viewDate, 'MMMM yyyy')}
            </YearPickerTitleText>
            <CaretDownIcon size={12} color={theme.semantic.text.secondary} />
          </YearPickerToggle>
        </YearPickerHeader>
        <YearGrid>
          {yearRange.map((year) => {
            const isSelectedYear = year === currentYear;
            return (
              <YearButton
                key={year}
                isSelected={isSelectedYear}
                onClick={() => { setViewDate(new Date(year, viewDate.getMonth(), 1)); setShowYears(false); }}
              >
                {year}
              </YearButton>
            );
          })}
        </YearGrid>
      </>
    ) : (
      <>
      {/* Header: < centered Month Year v > */}
      <MonthHeader>
        <NavButton
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeftIcon size={16} color={theme.semantic.text.secondary} />
        </NavButton>

        <MonthTitleButton
          onClick={() => setShowYears(true)}
          aria-label="Open year picker"
        >
          <MonthTitleText>
            {format(viewDate, 'MMMM yyyy')}
          </MonthTitleText>
          <CaretDownIcon size={14} color={theme.semantic.text.secondary} />
        </MonthTitleButton>

        <NavButton
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRightIcon size={16} color={theme.semantic.text.secondary} />
        </NavButton>
      </MonthHeader>

      {/* Day-of-week labels */}
      <DowGrid>
        {DOW_LABELS.map((label) => (
          <DowCell key={label}>
            <DowLabel>{label}</DowLabel>
          </DowCell>
        ))}
      </DowGrid>

      {/* Day grid */}
      <DayGrid
        role="grid"
        onMouseLeave={() => setHoverDate(null)}
      >
        {allDays.map((day) => {
          const state = getDayState({
            day, value, variant, pendingStart, hoverDate, minDate, maxDate, today, monthStart, monthEnd, dayAvailability,
          });

          return (
            <DayCell
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
                if (pendingStart && !state.isDisabled) setHoverDate(day);
              }}
              isOutsideMonth={state.isOutsideMonth}
              isSelected={state.isSelected}
              isPast={state.isPast}
              isRangeStart={state.isRangeStart}
              isRangeEnd={state.isRangeEnd}
              isRangeMiddle={state.isRangeMiddle}
              isDisabled={state.isDisabled}
              isWeekend={state.isWeekend}
              isToday={state.isToday}
              availability={state.availability}
            >
              <DayText component="span">
                {format(day, 'd')}
              </DayText>
            </DayCell>
          );
        })}
      </DayGrid>
      </>
    )}
    </CalendarRoot>
  );
}
