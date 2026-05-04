'use client';

/**
 * TimePickerField styles — mirrors DatePickerField's trigger / label / error
 * shell so time and date inputs look identical side-by-side, plus a dedicated
 * three-column panel (Hour | Minute | AM/PM) for the popover.
 */

import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

export const TimePickerOuterBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const TimePickerLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
  marginBottom: theme.customSpacing[2],
}));

export const TimePickerLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const TimePickerRequiredMark = styled(Box)<{ component?: React.ElementType }>(
  ({ theme }) => ({
    ...theme.customTypography.body2.medium,
    color: theme.semantic.error.main,
    flexShrink: 0,
  }),
);

/**
 * Trigger button — matches DatePickerField's outline look with an open/error
 * focus halo. Ghost variant removes the border for in-table embedding.
 */
export const TimePickerTrigger = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    !['isError', 'isOpen', 'isDisabled', 'isGhost', 'isSmall'].includes(prop as string),
})<{
  isError?: boolean;
  isOpen?: boolean;
  isDisabled?: boolean;
  isGhost?: boolean;
  isSmall?: boolean;
}>(({ theme, isError, isOpen, isDisabled, isGhost, isSmall }) => {
  let borderColor: string = isGhost ? 'transparent' : theme.semantic.border.default;
  let boxShadow = 'none';
  if (isError && isOpen) {
    borderColor = theme.semantic.error.main;
    boxShadow = theme.customShadows.focusError;
  } else if (isError) {
    borderColor = theme.semantic.error.main;
  } else if (isOpen) {
    borderColor = theme.semantic.primary.main;
    boxShadow = theme.customShadows.focusPrimary;
  }

  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: theme.customSpacing[1],
    height: isSmall ? theme.inputHeights.small : theme.inputHeights.base,
    backgroundColor: isGhost ? 'transparent' : theme.semantic.common.white,
    border: `1px solid ${borderColor}`,
    borderRadius: isSmall ? theme.customBorderRadius.lg : theme.customBorderRadius.xl,
    boxShadow,
    transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
    paddingTop: isSmall ? theme.customSpacing[1] : theme.customSpacing[3],
    paddingBottom: isSmall ? theme.customSpacing[1] : theme.customSpacing[3],
    paddingLeft: isGhost
      ? theme.customSpacing[2]
      : isSmall
        ? theme.customSpacing[2]
        : theme.customSpacing['3.5'],
    paddingRight: isGhost
      ? theme.customSpacing[2]
      : isSmall
        ? theme.customSpacing[2]
        : theme.customSpacing[3],
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    textAlign: 'left' as const,
    fontFamily: 'inherit',
    '&:hover': isGhost && !isDisabled && !isOpen
      ? { backgroundColor: theme.semantic.action.hover }
      : undefined,
  };
});

export const TimePickerTriggerText = styled(Typography, {
  shouldForwardProp: (prop) => !['isPlaceholder', 'isSmall'].includes(prop as string),
})<{ isPlaceholder?: boolean; isSmall?: boolean }>(({ theme, isPlaceholder, isSmall }) => ({
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  flex: 1,
  color: isPlaceholder ? theme.semantic.text.secondary : theme.semantic.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const TimePickerChevronWrap = styled(Box)<{ component?: React.ElementType }>(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
}));

export const TimePickerHelperText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.caption.regular,
  color: theme.semantic.text.secondary,
  marginTop: theme.customSpacing[1],
}));

export const TimePickerErrorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const TimePickerErrorText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
}));

// ── Popover panel ────────────────────────────────────────────────────────────

/** Three-column grid inside the popover. */
export const TimePanelColumns = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[1],
  padding: theme.customSpacing[2],
}));

/**
 * One scrollable column (hour / minute / AM-PM). Fixed height shows ~6 items
 * at a time; `overflowY: auto` lets the user scroll to reach the rest.
 * `scrollSnapType: y mandatory` snaps the scroll position to item boundaries
 * so values line up cleanly after a flick.
 */
export const TimeColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing['0.5'],
  height: 220,
  minWidth: 56,
  overflowY: 'auto',
  scrollSnapType: 'y mandatory',
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.colors.slate[300]} transparent`,
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    background: theme.colors.slate[300],
    borderRadius: theme.customBorderRadius.full,
    '&:hover': { background: theme.colors.slate[400] },
  },
}));

/** Single option cell inside a column. */
export const TimeCell = styled(ButtonBase, {
  shouldForwardProp: (prop) => !['isSelected', 'isDisabled'].includes(prop as string),
})<{ isSelected?: boolean; isDisabled?: boolean }>(({ theme, isSelected, isDisabled }) => ({
  ...theme.customTypography.body2.regular,
  minHeight: 32,
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  borderRadius: theme.customBorderRadius.default,
  scrollSnapAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: isSelected
    ? theme.semantic.primary.main
    : isDisabled
      ? theme.semantic.text.disabled
      : theme.semantic.text.primary,
  backgroundColor: isSelected ? theme.semantic.primary.swatch : 'transparent',
  fontWeight: isSelected ? 600 : 400,
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  pointerEvents: isDisabled ? 'none' : 'auto',
  transition: 'background-color 0.1s, color 0.1s',
  '&:hover': !isDisabled && !isSelected
    ? { backgroundColor: theme.semantic.action.hover }
    : undefined,
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: -2,
  },
}));

/** Thin vertical divider between columns. */
export const TimeColumnDivider = styled(Box)(({ theme }) => ({
  width: 1,
  alignSelf: 'stretch',
  backgroundColor: theme.semantic.divider,
  margin: `${theme.customSpacing[1]} 0`,
}));
