'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';

export const TextareaWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const TextareaLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
  marginBottom: theme.customSpacing[2],
}));

export const TextareaLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const TextareaRequiredMark = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
  flexShrink: 0,
}));

export const TextareaBox = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isError', 'isFocused', 'isDisabled', 'isSmall'].includes(prop as string),
})<{ isError?: boolean; isFocused?: boolean; isDisabled?: boolean; isSmall?: boolean }>(
  ({ theme, isError, isFocused, isDisabled, isSmall }) => {
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

    return {
      backgroundColor: theme.semantic.common.white,
      borderRadius: isSmall ? theme.customBorderRadius.lg : theme.customBorderRadius.xl,
      border: `1px solid ${borderColor}`,
      boxShadow,
      transition: 'border-color 0.15s, box-shadow 0.15s',
      paddingLeft: isSmall ? theme.customSpacing[3] : theme.customSpacing['3.5'],
      paddingRight: isSmall ? theme.customSpacing[3] : theme.customSpacing['3.5'],
      paddingTop: isSmall ? theme.customSpacing[1] : theme.customSpacing[2],
      paddingBottom: isSmall ? theme.customSpacing[1] : theme.customSpacing[2],
      cursor: isDisabled ? 'not-allowed' : 'text',
      opacity: isDisabled ? 0.6 : 1,
    };
  },
);

export const TextareaInput = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: theme.semantic.text.primary,
  display: 'block',
  '& textarea': {
    padding: 0,
    color: 'inherit',
    resize: 'vertical',
    '&::placeholder': { color: theme.semantic.text.secondary, opacity: 1 },
    '&:disabled': {
      cursor: 'not-allowed',
      WebkitTextFillColor: theme.semantic.text.disabled,
      resize: 'none',
    },
  },
}));

export const TextareaErrorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const TextareaErrorText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
}));
