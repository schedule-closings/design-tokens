'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const HEADER_HEIGHT = 88;
const CONTAINER_MAX_WIDTH = 1512;

export const TogglePill = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: `${HEADER_HEIGHT + 24}px`,
  right: theme.customSpacing[4],
  [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
    right: `calc(max(0px, (100vw - ${CONTAINER_MAX_WIDTH}px) / 2) + ${theme.customSpacing[6]})`,
  },
  zIndex: 1200,
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: '7px',
  paddingBottom: '7px',
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.base,
  border: `1px solid ${theme.semantic.divider}`,
  boxShadow: theme.customShadows.md,
  cursor: 'pointer',
  color: theme.semantic.text.secondary,
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
  '&:hover': {
    backgroundColor: theme.semantic.background.paper,
    color: theme.semantic.text.primary,
    borderColor: theme.semantic.primary.outlinedBorder,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: 2,
  },
})) as typeof Box;

export const ToggleLabel = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: theme.fontWeights.medium,
  color: 'inherit',
  lineHeight: 1,
  userSelect: 'none',
})) as typeof Typography;
