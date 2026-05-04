'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const PanelRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  height: '100%',
  border: `1px solid ${theme.semantic.divider}`,
  borderRadius: theme.customBorderRadius.xl,
  boxShadow: theme.customShadows.base,
  overflow: 'hidden',
  // Mobile --- full-bleed: drop the card chrome so header/body/actions
  // span the full viewport width.
  [theme.breakpoints.down('md')]: {
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
  },
}));

export const PanelHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.base,
  borderBottom: `1px solid ${theme.semantic.divider}`,
  paddingTop: theme.customSpacing[4],
  paddingBottom: theme.customSpacing[4],
  paddingLeft: theme.customSpacing[5],
  paddingRight: theme.customSpacing[5],
  flexShrink: 0,
}));

export const PanelBody = styled(Box)(({ theme }) => ({
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.base,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: theme.customSpacing[4],
  paddingBottom: theme.customSpacing[4],
  paddingLeft: theme.customSpacing[5],
  paddingRight: theme.customSpacing[5],
  minHeight: 0,
  overflow: 'auto',
}));

export const PanelActions = styled(Box)(({ theme }) => ({
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.base,
  borderTop: `1px solid ${theme.semantic.divider}`,
  // Subtle upward shadow to separate actions from scrollable content
  boxShadow: '0px -4px 6px rgba(0,0,0,0.05), 0px -2px 4px rgba(0,0,0,0.03)',
  paddingTop: theme.customSpacing[4],
  paddingBottom: theme.customSpacing[4],
  paddingLeft: theme.customSpacing[8],
  paddingRight: theme.customSpacing[8],
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));
