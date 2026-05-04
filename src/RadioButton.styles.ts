'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const RadioWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isSelected', 'hasLabel', 'isDisabled'].includes(prop as string),
})<{ isSelected?: boolean; hasLabel?: boolean; isDisabled?: boolean } & { component?: React.ElementType }>(
  ({ theme, isSelected, hasLabel, isDisabled }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: hasLabel ? theme.customSpacing[2] : 0,
    ...(!hasLabel ? { width: 24, height: 24, justifyContent: 'center' } : {}),
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.4 : 1,
    userSelect: 'none',
    outline: 'none',
    '&:focus-visible .rb-control': {
      outline: `2px solid ${theme.semantic.primary.main}`,
      outlineOffset: 2,
    },
    ...(!isDisabled
      ? {
          '&:hover .rb-control': {
            borderColor: isSelected ? undefined : theme.semantic.primary.main,
          },
        }
      : {}),
  }),
);

export const RadioControl = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  width: 16,
  height: 16,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isSelected ? theme.semantic.primary.main : theme.semantic.common.white,
  border: isSelected ? 'none' : `1px solid ${theme.colors.gray[500]}`,
  borderRadius: theme.customBorderRadius.full,
  transition: 'background-color 0.15s, border-color 0.15s',
}));

export const RadioDot = styled(Box)(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: theme.semantic.common.white,
}));

export const RadioLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: theme.semantic.text.primary,
}));
