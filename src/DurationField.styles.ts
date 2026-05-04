'use client';

/**
 * DurationField styles — an amount-plus-unit input. Mirrors the shell of
 * TextInputField (label, required mark, helper row, error row) and uses a
 * single visual box that splits horizontally between the numeric input and
 * the unit adornment (fixed label) or inline selector (select mode).
 */

import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

export const DurationFieldOuterBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const DurationFieldLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
  marginBottom: theme.customSpacing[2],
}));

export const DurationFieldLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const DurationFieldRequiredMark = styled(Box)<{ component?: React.ElementType }>(
  ({ theme }) => ({
    ...theme.customTypography.body2.medium,
    color: theme.semantic.error.main,
    flexShrink: 0,
  }),
);

/**
 * The outer visual box. Holds the amount input on the left and the unit
 * adornment / select on the right. Renders the same focus halo and error
 * styling as TextInputField / SelectField.
 */
export const DurationFieldContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isError', 'isFocused', 'isDisabled', 'isSmall', 'isGhost'].includes(prop as string),
})<{
  isError?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  isSmall?: boolean;
  isGhost?: boolean;
}>(({ theme, isError, isFocused, isDisabled, isSmall, isGhost }) => {
  let borderColor: string = isGhost ? 'transparent' : theme.semantic.border.default;
  let boxShadow = 'none';
  if (isDisabled) {
    borderColor = theme.colors.gray[300];
  } else if (isError && isFocused) {
    borderColor = theme.semantic.error.main;
    boxShadow = theme.customShadows.focusError;
  } else if (isError) {
    borderColor = theme.semantic.error.main;
  } else if (isFocused) {
    borderColor = theme.semantic.primary.main;
    boxShadow = theme.customShadows.focusPrimary;
  }

  return {
    display: 'flex',
    alignItems: 'stretch',
    width: '100%',
    height: isSmall ? theme.inputHeights.small : theme.inputHeights.base,
    backgroundColor: isGhost ? 'transparent' : theme.semantic.common.white,
    border: `1px solid ${borderColor}`,
    borderRadius: isSmall ? theme.customBorderRadius.lg : theme.customBorderRadius.xl,
    boxShadow,
    transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
    overflow: 'hidden',
    cursor: isDisabled ? 'not-allowed' : 'text',
    opacity: isDisabled ? 0.6 : 1,
    '&:hover': isGhost && !isDisabled && !isFocused
      ? { backgroundColor: theme.semantic.action.hover }
      : undefined,
  };
});

/**
 * Numeric amount input. Flex-grows to fill the box; native spinner arrows
 * are hidden because they clash with the inline unit adornment and vary
 * across browsers. Users can still step via keyboard (↑/↓).
 */
export const DurationFieldAmountInput = styled(InputBase, {
  shouldForwardProp: (prop) => !['isSmall'].includes(prop as string),
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  flex: 1,
  minWidth: 0,
  paddingLeft: isSmall ? theme.customSpacing[2] : theme.customSpacing[3],
  // `paddingRight` controls the breathing room between the numeric value
  // and the unit (adornment or select button). Lives INSIDE the input's
  // content box so `field-sizing: content` carries the gap along as the
  // value grows — the unit never feels stuck while the digit expands.
  // 8px at base size, 4px at small to match the tighter rhythm.
  paddingRight: isSmall ? theme.customSpacing[1] : theme.customSpacing[2],
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: theme.semantic.text.primary,
  '& input': {
    padding: 0,
    color: 'inherit',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    MozAppearance: 'textfield',
    '&::placeholder': { color: theme.semantic.text.secondary, opacity: 1 },
    '&:disabled': { cursor: 'not-allowed' },
  },
}));

/**
 * Fixed-unit adornment — a static label (e.g. "min", "hr", "day") shown
 * to the right of the amount input. Non-interactive. Padded to breathe
 * from the right edge, no divider (we match ComboField which dropped its
 * divider for a cleaner inline look).
 */
export const DurationFieldUnitAdornment = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  paddingLeft: theme.customSpacing[1],
  paddingRight: isSmall ? theme.customSpacing[2] : theme.customSpacing[3],
  userSelect: 'none',
  flexShrink: 0,
}));

export const DurationFieldUnitText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
}));

/**
 * Select-mode unit button — a pill sitting inside the box at the right,
 * shorter than the container so a subtle padding frames it from the box
 * border. Hover surfaces an action-hover tint. Modeled on ComboField's
 * `ComboOptionButton`.
 */
export const DurationFieldUnitButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => !['isOpen', 'isDisabled', 'isSmall'].includes(prop as string),
})<{
  isOpen?: boolean;
  isDisabled?: boolean;
  isSmall?: boolean;
}>(({ theme, isOpen, isDisabled, isSmall }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  paddingLeft: theme.customSpacing[2],
  paddingRight: theme.customSpacing[2],
  marginRight: theme.customSpacing[1],
  alignSelf: 'center',
  height: `calc(100% - ${theme.customSpacing[2]})`,
  borderRadius: isSmall ? theme.customBorderRadius.md : theme.customBorderRadius.lg,
  flexShrink: 0,
  background: isOpen ? theme.semantic.action.hover : 'none',
  border: 'none',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  color: theme.semantic.text.secondary,
  fontFamily: 'inherit',
  transition: 'background-color 0.15s',
  '&:hover': !isDisabled && !isOpen
    ? { backgroundColor: theme.semantic.action.hover }
    : {},
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: 2,
  },
  '& .duration-chevron': {
    display: 'inline-flex',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
  },
}));

/** One row in the unit dropdown panel. */
export const DurationFieldUnitOption = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  ...theme.customTypography.body2.regular,
  display: 'flex',
  alignItems: 'center',
  minWidth: 120,
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  borderRadius: theme.customBorderRadius.default,
  cursor: 'pointer',
  color: isSelected ? theme.semantic.primary.main : theme.semantic.text.primary,
  backgroundColor: isSelected ? theme.semantic.primary.swatch : 'transparent',
  fontWeight: isSelected ? 600 : 400,
  transition: 'background-color 0.1s',
  '&:hover': !isSelected
    ? { backgroundColor: theme.semantic.action.hover }
    : {},
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: -2,
  },
}));

export const DurationFieldHelperText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.caption.regular,
  color: theme.semantic.text.secondary,
  marginTop: theme.customSpacing[1],
}));

export const DurationFieldErrorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const DurationFieldErrorText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
}));
