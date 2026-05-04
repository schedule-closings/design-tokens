'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const CARD_ROOT_PROPS = ['selected', 'muted'] as const;

export const CardRoot = styled(Box, {
  shouldForwardProp: (prop) => !(CARD_ROOT_PROPS as readonly string[]).includes(prop as string),
})<{
  selected?: boolean;
  muted?: boolean;
}>(({ theme, selected, muted }) => ({
  '--sc-cspcard-selected-bg': theme.colors.blue[50],
  '[data-color-mode="dark"] &': {
    '--sc-cspcard-selected-bg': theme.semantic.action.selected,
  },
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[3],
  padding: theme.customSpacing[3],
  cursor: 'pointer',
  backgroundColor: selected
    ? 'var(--sc-cspcard-selected-bg)'
    : muted
      ? 'transparent'
      : theme.semantic.common.white,
  backgroundImage: selected || muted ? 'none' : theme.surfaceOverlay.high,
  border: `1px solid ${selected ? theme.semantic.primary.light : theme.semantic.divider}`,
  borderRadius: theme.customBorderRadius.xl,
  position: 'relative',
  overflow: 'hidden',
  transition: 'border-color 0.15s, background-color 0.15s, filter 0.2s, opacity 0.2s',
  filter: muted ? 'grayscale(100%)' : 'none',
  opacity: muted ? 0.7 : 1,
  '&:hover': {
    borderColor: selected ? theme.semantic.primary.light : theme.semantic.primary.main,
    backgroundColor: selected ? 'var(--sc-cspcard-selected-bg)' : theme.semantic.action.hover,
    filter: 'none',
    opacity: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(120deg, transparent 30%, ${theme.colors.blue[100]}80 50%, transparent 70%)`,
    backgroundSize: '200% 100%',
    backgroundPosition: '100% 0',
    pointerEvents: 'none',
    opacity: 0,
  },
  '&:active::after': {
    animation: 'csp-shimmer 0.6s ease-out',
  },
  '@keyframes csp-shimmer': {
    '0%': { opacity: 1, backgroundPosition: '100% 0' },
    '100%': { opacity: 0, backgroundPosition: '-100% 0' },
  },
}));

export const LeftColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  gap: theme.customSpacing[3],
  minWidth: 0,
}));

export const InfoColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
}));

export const NameRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  minWidth: 0,
});

export const FavToggleBox = styled(Box)({
  flexShrink: 0,
  display: 'flex',
});

export const NameText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isLink',
})<{ isLink?: boolean; component?: React.ElementType }>(({ theme, isLink }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.primary.dark,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 0,
  textDecoration: 'none',
  ...(isLink && {
    '&:hover': { textDecoration: 'underline' },
  }),
}));

export const OfficesRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
}));

export const OfficesText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
}));

export const DotSeparator = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.primary,
}));

export const DistanceText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const VerticalDivider = styled(Box)(({ theme }) => ({
  width: 0,
  height: 56,
  borderLeft: `1px solid ${theme.semantic.divider}`,
  flexShrink: 0,
}));

export const MetaColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
  flexShrink: 0,
}));

export const MetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
}));

export const MetaLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'labelColor',
})<{ labelColor?: string }>(({ theme, labelColor }) => ({
  ...theme.customTypography.body2.regular,
  color: labelColor ?? theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
}));

export const HelpIconBox = styled(Box)({
  display: 'flex',
});

export const SelectedIndicatorBox = styled(Box)({
  width: 20,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
