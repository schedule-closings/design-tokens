'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

export const LocationFieldRoot = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const LocationLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
  marginBottom: theme.customSpacing[2],
}));

export const LocationLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const LocationRequiredMark = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
  flexShrink: 0,
}));

export const LocationInputBox = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isError', 'isFocused', 'isDisabled', 'isSmall', 'hasLeft'].includes(prop as string),
})<{ isError?: boolean; isFocused?: boolean; isDisabled?: boolean; isSmall?: boolean; hasLeft?: boolean }>(
  ({ theme, isError, isFocused, isDisabled, isSmall, hasLeft }) => {
    let borderColor: string = theme.colors.gray[500];
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

    const paddingLeft = hasLeft
      ? (isSmall ? theme.customSpacing[2] : theme.customSpacing[3])
      : (isSmall ? theme.customSpacing[3] : theme.customSpacing['3.5']);
    const paddingRight = isSmall ? theme.customSpacing[2] : theme.customSpacing[3];

    return {
      display: 'flex',
      alignItems: 'center',
      gap: theme.customSpacing[2],
      height: isSmall ? theme.inputHeights.small : theme.inputHeights.base,
      backgroundColor: theme.semantic.common.white,
      border: `1px solid ${borderColor}`,
      borderRadius: isSmall ? theme.customBorderRadius.lg : theme.customBorderRadius.xl,
      boxShadow,
      transition: 'border-color 0.15s, box-shadow 0.15s',
      paddingLeft,
      paddingRight,
      cursor: isDisabled ? 'not-allowed' : 'text',
      opacity: isDisabled ? 0.6 : 1,
      boxSizing: 'border-box' as const,
    };
  },
);

export const LocationInputBase = styled(InputBase, {
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
    '&:disabled': { cursor: 'not-allowed', WebkitTextFillColor: theme.semantic.text.disabled },
  },
}));

export const LocationAdornmentSlot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'iconSize',
})<{ iconSize?: number } & { component?: React.ElementType }>(({ iconSize = 20 }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: iconSize,
  height: iconSize,
  flexShrink: 0,
}));

export const LocationAdornmentWrap = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  color: theme.semantic.text.secondary,
}));

export const LocationClearButton = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  cursor: 'pointer',
  color: theme.semantic.text.secondary,
  '&:hover': { color: theme.semantic.text.primary },
}));

export const LocationSrOnly = styled(Box)(() => ({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
}));

export const LocationSuggestionList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const LocationCenteredBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: theme.customSpacing[10],
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
}));

export const LocationNoResultsText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
}));

export const LocationSuggestionItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isHighlighted',
})<{ isHighlighted?: boolean }>(({ theme, isHighlighted }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  cursor: 'pointer',
  transition: 'background-color 0.1s',
  backgroundColor: isHighlighted ? theme.semantic.primary.light : 'transparent',
  '&:hover': { backgroundColor: isHighlighted ? theme.semantic.primary.light : theme.semantic.action.hover },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '-2px',
  },
}));

export const LocationSuggestionLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.primary,
}));

export const LocationSuggestionSublabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.caption.regular,
  color: theme.semantic.text.secondary,
}));

export const LocationErrorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const LocationErrorText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
}));

export const LocationHelperText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.caption.regular,
  color: theme.semantic.text.secondary,
  marginTop: theme.customSpacing[1],
}));
