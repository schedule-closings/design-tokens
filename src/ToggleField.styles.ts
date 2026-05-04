'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const ToggleFieldRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDisabled',
})<{ isDisabled?: boolean } & { component?: React.ElementType }>(({ theme, isDisabled }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.6 : 1,
}));

export const ToggleFieldLabelSpan = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
}));

export const ToggleFieldLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: theme.semantic.text.secondary,
  userSelect: 'none',
}));
