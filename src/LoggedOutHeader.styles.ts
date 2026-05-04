'use client';

import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import BaseButton from './BaseButton';

export const LOAppBar = styled(AppBar)({
  zIndex: 1100,
});

export const LOContainer = styled(Container)({
  maxWidth: 1512,
  padding: '0 !important',
});

export const LOToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  paddingLeft: theme.customSpacing[4],
  paddingRight: theme.customSpacing[4],
  paddingTop: theme.customSpacing[5],
  paddingBottom: theme.customSpacing[5],
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.customSpacing[6],
    paddingRight: theme.customSpacing[6],
  },
}));

export const LOLogoLink = styled('a')({
  display: 'flex',
  flexShrink: 0,
  textDecoration: 'none',
});

export const LOLogoImg = styled('img')({
  height: 40,
  width: 110.8,
  display: 'block',
});

export const LODrawerLogoImg = styled('img')({
  height: 32,
  display: 'block',
});

export const LORightBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[3],
}));

export const LONavLinksBox = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.customSpacing[2],
}));

export const LOCTAsBox = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.customSpacing[3],
}));

export const LONavButton = styled(BaseButton)({
  justifyContent: 'flex-start',
});

export const LOLoginButton = styled(BaseButton)({
  width: 100,
});

export const LOHamburgerButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderRadius: theme.customBorderRadius.xl,
  padding: theme.customSpacing[2],
}));

export const LODrawerPaperStyles = (theme: import('@mui/material/styles').Theme) => ({
  width: '100%',
  paddingLeft: theme.customSpacing[6],
  paddingRight: theme.customSpacing[6],
  paddingTop: theme.customSpacing[5],
  paddingBottom: theme.customSpacing[6],
  display: 'flex',
  flexDirection: 'column' as const,
  [theme.breakpoints.up('sm')]: {
    width: 320,
  },
});

export const LODrawerHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.customSpacing[6],
}));

export const LODrawerCloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderRadius: theme.customBorderRadius.xl,
  padding: theme.customSpacing[2],
}));

export const LODrawerNavBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
}));

export const LODrawerDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.customSpacing[6],
  marginBottom: theme.customSpacing[6],
  borderColor: theme.semantic.divider,
}));

export const LODrawerCTAsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
}));

export const LODrawerCTAButton = styled(BaseButton)({
  width: '100%',
});
