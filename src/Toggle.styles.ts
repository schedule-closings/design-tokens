'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const ToggleRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDisabled',
})<{ isDisabled?: boolean } & { component?: React.ElementType }>(({ theme, isDisabled }) => ({
  position: 'relative',
  display: 'inline-block',
  flexShrink: 0,
  border: 'none',
  padding: 0,
  background: 'none',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.5 : 1,
  borderRadius: theme.customBorderRadius.full,
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '2px',
  },
}));

export const ToggleTrack = styled(Box, {
  shouldForwardProp: (prop) => !['isChecked', 'isOffset'].includes(prop as string),
})<{ isChecked?: boolean; isOffset?: boolean }>(({ theme, isChecked, isOffset }) => ({
  position: 'absolute',
  top: 'var(--track-top)',
  bottom: 'var(--track-top)',
  left: 0,
  right: 0,
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: isChecked ? theme.semantic.success.main : theme.colors.gray[500],
  transition: 'background-color 0.2s',
  boxShadow: isOffset ? 'none' : theme.customShadows.inner,
}));

export const ToggleHandle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 'var(--handle-inset)',
  bottom: 'var(--handle-inset)',
  width: 'var(--handle-w)',
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: theme.semantic.background.paper,
  backgroundImage: theme.surfaceOverlay.high,
  border: `0.5px solid ${theme.semantic.divider}`,
  boxShadow: 'var(--handle-shadow)',
  left: 'var(--handle-left)',
  transition: 'left 0.2s ease',
}));
