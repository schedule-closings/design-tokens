'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

export const DatePickerWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const DatePickerLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
  marginBottom: theme.customSpacing[2],
}));

export const DatePickerLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const DatePickerRequiredMark = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
  flexShrink: 0,
}));

export const DatePickerTrigger = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    !['isError', 'isOpen', 'isDisabled'].includes(prop as string),
})<{ isError?: boolean; isOpen?: boolean; isDisabled?: boolean }>(
  ({ theme, isError, isOpen, isDisabled }) => {
    let borderColor: string = theme.semantic.border.default;
    let boxShadow = 'none';
    if (isError && isOpen) { borderColor = theme.semantic.error.main; boxShadow = theme.customShadows.focusError; }
    else if (isError) { borderColor = theme.semantic.error.main; }
    else if (isOpen) { borderColor = theme.semantic.primary.main; boxShadow = theme.customShadows.focusPrimary; }

    return {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: theme.customSpacing[2],
      height: theme.inputHeights.base,
      backgroundColor: theme.semantic.common.white,
      border: `1px solid ${borderColor}`,
      borderRadius: theme.customBorderRadius.xl,
      boxShadow,
      transition: 'border-color 0.15s, box-shadow 0.15s',
      paddingLeft: theme.customSpacing['3.5'],
      paddingRight: theme.customSpacing[3],
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.6 : 1,
      textAlign: 'left' as const,
      fontFamily: 'inherit',
    };
  }
);

export const DatePickerTriggerText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isPlaceholder',
})<{ isPlaceholder?: boolean }>(({ theme, isPlaceholder }) => ({
  ...theme.customTypography.body1.regular,
  flex: 1,
  color: isPlaceholder ? theme.semantic.text.secondary : theme.semantic.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const DatePickerHelperText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.caption.regular,
  color: theme.semantic.text.secondary,
  marginTop: theme.customSpacing[1],
}));

export const DatePickerErrorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const DatePickerErrorText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
}));

// ── Calendar panel (used by CalendarPanel.tsx) ───────────────────────────────

export const CalendarNav = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: theme.customSpacing[4],
  paddingRight: theme.customSpacing[4],
  paddingTop: theme.customSpacing[3],
  paddingBottom: theme.customSpacing[3],
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

export const CalendarNavTitle = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.semibold,
  color: theme.semantic.text.primary,
  cursor: 'pointer',
  '&:hover': { color: theme.semantic.primary.main },
}));

export const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  padding: theme.customSpacing[3],
  gap: theme.customSpacing['0.5'],
}));

export const CalendarWeekHeader = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.caption.semibold,
  color: theme.semantic.text.secondary,
  textAlign: 'center',
  paddingTop: theme.customSpacing[1],
  paddingBottom: theme.customSpacing[1],
}));

export const CalendarDay = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    !['isSelected', 'isInRange', 'isToday', 'isDisabled', 'isRangeStart', 'isRangeEnd'].includes(
      prop as string
    ),
})<{
  isSelected?: boolean;
  isInRange?: boolean;
  isToday?: boolean;
  isDisabled?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
}>(({ theme, isSelected, isInRange, isToday, isDisabled }) => ({
  width: 36,
  height: 36,
  borderRadius: theme.customBorderRadius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.4 : 1,
  backgroundColor: isSelected
    ? theme.semantic.primary.main
    : isInRange
    ? theme.semantic.primary.swatch
    : 'transparent',
  border: isToday && !isSelected ? `1px solid ${theme.semantic.primary.main}` : 'none',
  transition: 'background-color 0.1s',
  '&:hover': !isDisabled && !isSelected
    ? { backgroundColor: theme.semantic.action.hover }
    : {},
  '& .day-text': {
    color: isSelected
      ? theme.semantic.primary.contrastText
      : isInRange
      ? theme.semantic.primary.main
      : theme.semantic.text.primary,
    ...theme.customTypography.body2.regular,
  },
}));

// ── InternalCalendar styled components ───────────────────────────────────────

export const CalendarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
}));

export const CalendarHeaderRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const MonthYearButton = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
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

export const MonthYearLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.primary,
}));

export const NavButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
}));

export const NavButton = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.customSpacing[7],
  height: theme.customSpacing[7],
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: theme.semantic.text.secondary,
  borderRadius: theme.customBorderRadius.default,
  '&:hover': { backgroundColor: theme.semantic.action.hover },
  '&:focus-visible': { outline: `2px solid ${theme.semantic.primary.main}`, outlineOffset: '2px' },
}));

export const YearGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.customSpacing[1],
}));

export const YearCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelectedYear',
})<{ isSelectedYear?: boolean } & { component?: React.ElementType }>(({ theme, isSelectedYear }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: theme.customSpacing[8],
  background: isSelectedYear ? theme.semantic.primary.main : 'none',
  border: 'none',
  borderRadius: theme.customBorderRadius.default,
  cursor: 'pointer',
  color: isSelectedYear ? theme.semantic.common.white : theme.semantic.text.primary,
  fontFamily: theme.fontFamilies.body,
  ...theme.customTypography.body2.regular,
  '&:hover': isSelectedYear
    ? {}
    : { backgroundColor: theme.semantic.primary.swatch, color: theme.semantic.primary.main },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '2px',
  },
}));

export const DowHeaderGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(7, ${theme.customSpacing[8]})`,
  gap: 0,
}));

export const DowCell = styled(Box)(({ theme }) => ({
  width: theme.customSpacing[8],
  height: theme.customSpacing[8],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const DowLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
}));

export const DayGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(7, ${theme.customSpacing[8]})`,
  gap: 0,
}));

export const EmptyDayCell = styled(Box)(({ theme }) => ({
  width: theme.customSpacing[8],
  height: theme.customSpacing[8],
}));

export const DayText = styled(Typography)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: 'inherit',
  lineHeight: 1,
}));

export const TriggerCalendarIconWrap = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  color: theme.semantic.text.secondary,
}));

export const DatePickerOuterBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));
