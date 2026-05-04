'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const AccordionRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const AccordionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[3],
  padding: theme.customSpacing[4],
  backgroundColor: theme.semantic.background.paper,
  backgroundImage: theme.surfaceOverlay.high,
  cursor: 'pointer',
  userSelect: 'none',
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '-2px',
  },
}));

export const AccordionCheckboxSpan = styled(Box)<{ component?: React.ElementType }>({
  display: 'inline-flex',
  flexShrink: 0,
});

export const AccordionLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
  flex: 1,
}));

export const AccordionDivider = styled(Box)(({ theme }) => ({
  height: '1px',
  backgroundColor: theme.semantic.divider,
}));

export const AccordionBody = styled(Box)(({ theme }) => ({
  backgroundColor: theme.semantic.background.default,
  borderBottom: `1px solid ${theme.semantic.divider}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
  padding: theme.customSpacing[4],
}));
