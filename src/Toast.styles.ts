'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const ToastIconBox = styled(Box)({
  flexShrink: 0,
  display: 'flex',
  lineHeight: 0,
  marginTop: '3px',
});

export const ToastMessageText = styled('p', {
  shouldForwardProp: (prop) => prop !== 'darkColor',
})<{ darkColor?: string }>(({ theme, darkColor }) => ({
  ...theme.customTypography.body1.medium,
  flex: '1 0 0',
  minWidth: 0,
  margin: 0,
  '[data-color-mode="dark"] &': darkColor ? { color: darkColor } : {},
}));

export const ToastCloseButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'focusBorderColor',
})<{ focusBorderColor?: string } & { component?: React.ElementType }>(({ theme, focusBorderColor }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  border: 'none',
  padding: 0,
  background: 'none',
  cursor: 'pointer',
  lineHeight: 0,
  marginTop: '3px',
  borderRadius: theme.customBorderRadius.sm,
  '&:focus-visible': focusBorderColor
    ? { outline: `2px solid ${focusBorderColor}`, outlineOffset: '2px' }
    : {},
}));
