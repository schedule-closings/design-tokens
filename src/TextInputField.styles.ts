'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';

export const InputFieldWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const InputLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
  marginBottom: theme.customSpacing[2],
}));

export const InputLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const InputRequiredMark = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
  flexShrink: 0,
}));

export const InputBox = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isError', 'isFocused', 'isDisabled', 'isSmall', 'isGhost'].includes(prop as string),
})<{
  isError?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  isSmall?: boolean;
  isGhost?: boolean;
}>(({ theme, isError, isFocused, isDisabled, isSmall, isGhost }) => {
  let borderColor: string = isGhost ? 'transparent' : theme.colors.gray[500];
  let boxShadow = 'none';

  if (isDisabled) {
    borderColor = isGhost ? 'transparent' : theme.colors.gray[300];
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
    alignItems: 'center',
    backgroundColor: isGhost ? 'transparent' : theme.semantic.common.white,
    borderRadius: isSmall ? theme.customBorderRadius.lg : theme.customBorderRadius.xl,
    height: isSmall ? theme.inputHeights.small : theme.inputHeights.base,
    boxSizing: 'border-box',
    border: `1px solid ${borderColor}`,
    boxShadow,
    transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
    lineHeight: 1,
    paddingTop: isSmall ? theme.customSpacing[2] : theme.customSpacing[3],
    paddingBottom: isSmall ? theme.customSpacing[2] : theme.customSpacing[3],
    cursor: isDisabled ? 'not-allowed' : 'text',
    opacity: isDisabled ? 0.6 : 1,
    '&:hover': isGhost && !isDisabled && !isFocused
      ? { backgroundColor: theme.semantic.action.hover }
      : undefined,
  };
});

export const InputIconSlot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'iconSize',
})<{ iconSize?: number }>(({ iconSize = 20 }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: iconSize,
  height: iconSize,
  flexShrink: 0,
}));

export const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  flex: 1,
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  lineHeight: 1,
  color: theme.semantic.text.primary,
  '& input': {
    padding: 0,
    color: 'inherit',
    '&::placeholder': { color: theme.semantic.text.secondary, opacity: 1 },
    '&:disabled': {
      cursor: 'not-allowed',
      WebkitTextFillColor: theme.semantic.text.disabled,
    },
  },
}));

export const InputErrorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const InputErrorText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
  whiteSpace: 'nowrap',
}));

export const InputStatusRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const InputStatusText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.colors.gray[500],
}));

export const InputCriteriaBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[2],
  marginTop: theme.customSpacing[2],
}));

export const InputCriteriaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
}));

export const InputCriteriaText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.primary,
}));

export const PwCriteriaTooltipBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[2],
}));

export const PwCriteriaTooltipRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
}));

export const PwCriteriaNoWrapText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.common.white,
  whiteSpace: 'nowrap',
}));

export const PwToggleButton = styled(Box)<{ component?: React.ElementType }>({
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
});

export const InputLeftIconWrapperWithGap = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasRight',
})<{ hasRight?: boolean }>(({ theme, hasRight }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  color: theme.semantic.text.secondary,
  marginRight: hasRight ? theme.customSpacing[1] : undefined,
}));

export const InputRightIconWrapperWithGap = styled(Box, {
  shouldForwardProp: (prop) => !['isSuccess', 'hasLeft'].includes(prop as string),
})<{ isSuccess?: boolean; hasLeft?: boolean }>(({ theme, isSuccess, hasLeft }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  color: isSuccess ? theme.semantic.success.main : theme.semantic.text.secondary,
  marginLeft: hasLeft ? theme.customSpacing['2.5'] : undefined,
}));

export const InputSuggestionRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: isSmall ? theme.customSpacing[1] : theme.customSpacing[2],
  marginTop: theme.customSpacing[2],
  cursor: 'pointer',
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: 2,
    borderRadius: theme.customBorderRadius.default,
  },
}));

export const InputSuggestionLabelText = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: theme.semantic.text.primary,
}));

export const InputSuggestionMutedText = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: theme.semantic.text.secondary,
  marginLeft: theme.customSpacing[1],
}));
