'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const CheckboxWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isChecked', 'hasLabel', 'isDisabled'].includes(prop as string),
})<{ isChecked?: boolean; hasLabel?: boolean; isDisabled?: boolean } & { component?: React.ElementType }>(
  ({ theme, isChecked, hasLabel, isDisabled }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: hasLabel ? theme.customSpacing[2] : 0,
    ...(!hasLabel ? { width: 24, height: 24, justifyContent: 'center' } : {}),
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.4 : 1,
    userSelect: 'none',
    outline: 'none',
    '&:focus-visible .cb-control': {
      outline: `2px solid ${theme.semantic.primary.main}`,
      outlineOffset: 2,
    },
    ...(!isDisabled
      ? {
          '&:hover .cb-control': {
            borderColor: isChecked ? undefined : theme.semantic.primary.main,
          },
        }
      : {}),
  }),
);

export const CheckboxControl = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isChecked',
})<{ isChecked?: boolean }>(({ theme, isChecked }) => ({
  width: 16,
  height: 16,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isChecked ? theme.semantic.primary.main : theme.semantic.common.white,
  border: isChecked ? 'none' : `1px solid ${theme.colors.gray[500]}`,
  borderRadius: theme.customBorderRadius.none,
  transition: 'background-color 0.15s, border-color 0.15s',
}));

export const CheckboxLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: theme.semantic.text.primary,
}));
