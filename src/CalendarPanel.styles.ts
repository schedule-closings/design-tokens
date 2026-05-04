'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/* ── Root Container ──────────────────────────────────────────────────────── */

export const CalendarRoot = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
  padding: theme.customSpacing[4],
  borderRadius: theme.customBorderRadius.xl,
  border: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.mid,
  boxShadow: 'var(--sc-calendar-shadow)',
  width: 'fit-content',
}));

/* ── Year Picker ─────────────────────────────────────────────────────────── */

export const YearPickerHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const YearPickerToggle = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  color: theme.semantic.text.primary,
  fontFamily: theme.fontFamilies.body,
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '2px',
    borderRadius: theme.customBorderRadius.default,
  },
}));

export const YearPickerTitleText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
}));

export const YearGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.customSpacing[2],
}));

export const YearButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: theme.customSpacing[9],
  background: isSelected ? theme.semantic.primary.main : 'none',
  border: 'none',
  borderRadius: theme.customBorderRadius.default,
  cursor: 'pointer',
  color: isSelected ? theme.semantic.common.white : theme.semantic.text.primary,
  fontFamily: theme.fontFamilies.body,
  ...theme.customTypography.body1.regular,
  '&:hover': isSelected
    ? {}
    : {
        backgroundColor: theme.semantic.primary.swatch,
        color: theme.semantic.primary.main,
      },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '2px',
  },
}));

/* ── Month Header ────────────────────────────────────────────────────────── */

export const MonthHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const NavButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.customSpacing[8],
  height: theme.customSpacing[8],
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: theme.semantic.text.secondary,
  borderRadius: theme.customBorderRadius.default,
  '&:hover': {
    backgroundColor: theme.semantic.action.hover,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '2px',
  },
}));

export const MonthTitleButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  color: theme.semantic.text.primary,
  fontFamily: theme.fontFamilies.body,
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '2px',
    borderRadius: theme.customBorderRadius.default,
  },
}));

export const MonthTitleText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
}));

/* ── Day-of-week / Grid ──────────────────────────────────────────────────── */

export const DowGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'var(--cal-grid-cols)',
  gap: theme.customSpacing[2],
}));

export const DowCell = styled(Box)(() => ({
  width: 'var(--cal-cell-size)',
  height: 'var(--cal-cell-size)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const DowLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.secondary,
}));

export const DayGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'var(--cal-grid-cols)',
  gap: theme.customSpacing[2],
}));

/* ── Day Cell ────────────────────────────────────────────────────────────── */

/**
 * The day cell has many visual states that interact.
 * We use transient props to compute the correct styles.
 */

interface DayCellProps {
  isOutsideMonth?: boolean;
  isSelected?: boolean;
  isPast?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isRangeMiddle?: boolean;
  isDisabled?: boolean;
  isWeekend?: boolean;
  isToday?: boolean;
  availability?: 'high' | 'low' | 'none';
}

const dayCellCustomProps: string[] = [
  'isOutsideMonth',
  'isSelected',
  'isPast',
  'isRangeStart',
  'isRangeEnd',
  'isRangeMiddle',
  'isDisabled',
  'isWeekend',
  'isToday',
  'availability',
];

export const DayCell = styled(Box, {
  shouldForwardProp: (prop) => !dayCellCustomProps.includes(prop as string),
})<DayCellProps>(({ theme, ...props }) => {
  const {
    isOutsideMonth,
    isSelected,
    isPast,
    isRangeStart,
    isRangeEnd,
    isRangeMiddle,
    isDisabled,
    isWeekend,
    isToday,
    availability,
  } = props;

  const base: Record<string, unknown> = {
    width: 'var(--cal-cell-size)',
    height: 'var(--cal-cell-size)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isDisabled ? 'default' : 'pointer',
    position: 'relative',
    userSelect: 'none',
    flexShrink: 0,
  };

  if (isOutsideMonth) {
    return {
      ...base,
      borderRadius: theme.customBorderRadius.lg,
      color: theme.semantic.text.secondary,
      opacity: 0.4,
    };
  }

  if (isSelected) {
    return {
      ...base,
      backgroundColor: theme.semantic.primary.main,
      borderRadius: theme.customBorderRadius.lg,
      color: theme.semantic.common.white,
      cursor: 'pointer',
    };
  }

  if (isPast) {
    return {
      ...base,
      borderRadius: theme.customBorderRadius.lg,
      color: theme.semantic.text.secondary,
      opacity: 0.4,
      cursor: 'pointer',
    };
  }

  const swatchColor = theme.semantic.primary.swatch;
  const gapHalf = '4px';

  if (isRangeStart) {
    return {
      ...base,
      backgroundColor: theme.semantic.primary.main,
      borderTopLeftRadius: theme.customBorderRadius.lg,
      borderBottomLeftRadius: theme.customBorderRadius.lg,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      color: theme.semantic.common.white,
      zIndex: 1,
      boxShadow: `${gapHalf} 0 0 0 ${swatchColor}`,
    };
  }

  if (isRangeEnd) {
    return {
      ...base,
      backgroundColor: theme.semantic.primary.main,
      borderTopRightRadius: theme.customBorderRadius.lg,
      borderBottomRightRadius: theme.customBorderRadius.lg,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      color: theme.semantic.common.white,
      zIndex: 1,
      boxShadow: `-${gapHalf} 0 0 0 ${swatchColor}`,
    };
  }

  if (isRangeMiddle) {
    return {
      ...base,
      backgroundColor: theme.semantic.primary.swatch,
      borderRadius: 0,
      color: theme.semantic.primary.main,
      boxShadow: `${gapHalf} 0 0 0 ${swatchColor}, -${gapHalf} 0 0 0 ${swatchColor}`,
    };
  }

  if (isDisabled) {
    return {
      ...base,
      color: theme.semantic.text.secondary,
      borderRadius: theme.customBorderRadius.lg,
    };
  }

  if (isWeekend) {
    return {
      ...base,
      borderRadius: theme.customBorderRadius.lg,
      color: theme.semantic.text.secondary,
      opacity: 0.4,
    };
  }

  const todayBorder = isToday ? `1px solid ${theme.semantic.divider}` : 'none';

  if (availability === 'high') {
    return {
      ...base,
      backgroundColor: theme.colors.blue[50],
      borderRadius: theme.customBorderRadius.lg,
      border: todayBorder,
      color: theme.semantic.primary.dark,
      '&:hover': {
        backgroundColor: theme.colors.blue[100],
        color: theme.semantic.primary.dark,
      },
      '[data-color-mode="dark"] &': {
        backgroundColor: `color-mix(in srgb, ${theme.colors.blue[500]} 10%, transparent)`,
        color: theme.colors.blue[300],
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.colors.blue[500]} 18%, transparent)`,
        },
      },
    };
  }

  if (availability === 'low') {
    return {
      ...base,
      backgroundColor: theme.colors.yellow[50],
      borderRadius: theme.customBorderRadius.lg,
      border: todayBorder,
      color: theme.semantic.alert.dark,
      '&:hover': {
        backgroundColor: theme.colors.yellow[100],
        color: theme.semantic.alert.dark,
      },
      '[data-color-mode="dark"] &': {
        backgroundColor: `color-mix(in srgb, ${theme.colors.yellow[500]} 20%, transparent)`,
        color: theme.colors.yellow[300],
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.colors.yellow[500]} 28%, transparent)`,
        },
      },
    };
  }

  if (availability === 'none') {
    return {
      ...base,
      backgroundColor: theme.colors.red[50],
      borderRadius: theme.customBorderRadius.lg,
      border: todayBorder,
      color: theme.semantic.error.dark,
      '&:hover': {
        backgroundColor: theme.colors.red[100],
        color: theme.semantic.error.dark,
      },
      '[data-color-mode="dark"] &': {
        backgroundColor: `color-mix(in srgb, ${theme.colors.red[500]} 10%, transparent)`,
        color: theme.colors.red[300],
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.colors.red[500]} 18%, transparent)`,
        },
      },
    };
  }

  // Default: normal in-month weekday
  return {
    ...base,
    borderRadius: theme.customBorderRadius.lg,
    border: todayBorder,
    color: theme.semantic.text.primary,
    '&:hover': {
      backgroundColor: theme.semantic.primary.swatch,
      color: theme.semantic.primary.dark,
    },
  };
});

export const DayText = styled(Typography)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: 'inherit',
  lineHeight: 1,
}));
