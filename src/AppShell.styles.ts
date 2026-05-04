'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import SmoothBox from './SmoothBox';

export const ShellRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: theme.semantic.common.white,
  fontFamily: theme.fontFamilies.body,
}));

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  boxShadow: 'var(--sc-header-shadow)',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  zIndex: 10,
  position: 'relative',
}));

export const BodyWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  backgroundColor: theme.semantic.background.default,
}));

export const BodyInner = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[5],
  maxWidth: 1512,
  margin: '0 auto',
  width: '100%',
  height: '100%',
  padding: theme.customSpacing[4],
  boxSizing: 'border-box',
  [theme.breakpoints.down('md')]: {
    padding: 0,
  },
}));

export const SideNavDesktop = styled(Box)(({ theme }) => ({
  display: 'none',
  position: 'relative',
  alignSelf: 'flex-start',
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
  },
}));

export const AppDrawer = styled(Drawer)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    display: 'none',
  },
  '& .MuiDrawer-paper': {
    width: 320,
    backgroundColor: theme.semantic.common.white,
    boxShadow: theme.customShadows.lg,
  },
}));

export const ContentMain = styled(SmoothBox)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[4],
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.base,
  border: `1px solid ${theme.semantic.divider}`,
  boxShadow: 'var(--sc-panel-shadow)',
  height: '100%',
  padding: theme.customSpacing[5],
  [theme.breakpoints.down('md')]: {
    border: 'none',
    boxShadow: 'none',
    padding: 0,
    '&::before': { display: 'none' },
  },
}));
