'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const LIAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: 1100,
  backgroundColor: theme.semantic.background.paper,
  color: theme.semantic.text.primary,
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

export const LIOuterContainer = styled(Container)({
  '&&': {
    maxWidth: 1512,
    paddingLeft: 0,
    paddingRight: 0,
  },
});

export const LIToolbar = styled(Toolbar)(({ theme }) => ({
  '&&': { minHeight: 88 },
  height: 88,
  paddingLeft: theme.customSpacing[4],
  paddingRight: theme.customSpacing[4],
  paddingTop: theme.customSpacing[6],
  paddingBottom: theme.customSpacing[6],
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.customSpacing[6],
    paddingRight: theme.customSpacing[6],
  },
  [theme.breakpoints.up('lg')]: {
    paddingTop: theme.customSpacing[5],
    paddingBottom: theme.customSpacing[5],
  },
}));

export const LIDesktopTabletRow = styled(Box)({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const logoLinkStyles = {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  textDecoration: 'none',
} as const;

export const getFullLogoStyles = (darkMode: boolean) => ({
  height: 40,
  width: 110.8,
  ...(darkMode && { filter: 'brightness(0) invert(1)' }),
});

export const getSymbolLogoStyles = (darkMode: boolean) => ({
  width: 40,
  height: 40,
  ...(darkMode && { filter: 'brightness(0) invert(1)' }),
});

export const LILeftBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[3],
  flexShrink: 0,
}));

export const LIRightBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[3],
}));

export const LIViewingPill = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  padding: `${theme.customSpacing[1]} ${theme.customSpacing[2]}`,
  borderRadius: theme.customBorderRadius.full,
  whiteSpace: 'nowrap',
}));

export const LIViewingLink = styled('a')(({ theme }) => ({
  fontSize: 16,
  fontWeight: theme.fontWeights.regular,
  color: theme.semantic.text.primary,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  '&:hover': { textDecoration: 'underline' },
}));

export const LIViewingMobilePill = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing['0.5'],
  padding: `${theme.customSpacing[1]} ${theme.customSpacing[2]}`,
  borderRadius: theme.customBorderRadius.full,
  cursor: 'pointer',
}));

export const LIViewingDesktopBox = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.customSpacing[2],
}));

export const LIViewingText = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'badgeColor',
})<{ badgeColor?: string } & { component?: React.ElementType }>(({ theme, badgeColor }) => ({
  fontSize: 14,
  fontWeight: theme.fontWeights.semibold,
  color: badgeColor,
  whiteSpace: 'nowrap',
  lineHeight: 1,
}));

export const LISendInviteIconBtn = styled(IconButton)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.secondary.main,
  borderRadius: theme.customBorderRadius.xl,
  padding: theme.customSpacing[2],
  '&:hover': {
    backgroundColor: 'rgba(147,51,234,0.04)',
    borderColor: theme.palette.secondary.main,
  },
}));

export const LIScheduleClosingIconBtn = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.customBorderRadius.xl,
  padding: theme.customSpacing[2],
  '&:hover': {
    backgroundColor: theme.semantic.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.semantic.action.disabledBackground,
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

export const LIResourcesIconBtn = styled(IconButton)(({ theme }) => ({
  padding: theme.customSpacing['0.5'],
  borderRadius: theme.customBorderRadius.xl,
  '&:hover': {
    backgroundColor: theme.semantic.action.hover,
  },
}));

export const LINotificationsIconBtn = styled(IconButton)(({ theme }) => ({
  padding: 0,
  borderRadius: theme.customBorderRadius.full,
  '&:hover': {
    backgroundColor: theme.semantic.action.hover,
  },
}));

export const LIProfileButton = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  borderRadius: theme.customBorderRadius.full,
  padding: 0,
  color: theme.semantic.text.primary,
  '&:hover': { opacity: 0.85 },
}));

export const LIMobileRow = styled(Box)({
  width: '100%',
  alignItems: 'center',
});

export const LIMobileLeftCol = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
}));

export const LIHamburgerBtn = styled(IconButton)({
  padding: 0,
  '&:hover': { backgroundColor: 'transparent' },
});

export const LIMobileRightCol = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.customSpacing[2],
}));

export const LIMobileNotificationsBtn = styled(IconButton)({
  padding: 0,
  '&:hover': { backgroundColor: 'transparent' },
});

export const LIDropdownItem = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  width: '100%',
  padding: `${theme.customSpacing[3]} ${theme.customSpacing[2]}`,
  borderRadius: theme.customBorderRadius.xl,
  justifyContent: 'flex-start',
  cursor: 'pointer',
  color: theme.semantic.text.primary,
  '&:hover': { backgroundColor: theme.semantic.action.hover },
}));

export const LIDropdownItemBtn = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isDisabled',
})<{ isDisabled?: boolean }>(({ theme, isDisabled }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  width: '100%',
  padding: `${theme.customSpacing[3]} ${theme.customSpacing[2]}`,
  borderRadius: theme.customBorderRadius.xl,
  justifyContent: 'flex-start',
  color: theme.semantic.text.primary,
  opacity: isDisabled ? 0.4 : 1,
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  pointerEvents: isDisabled ? 'none' : 'auto',
  '&:hover': { backgroundColor: isDisabled ? 'transparent' : theme.semantic.action.hover },
}));

export const LIDropdownIconBox = styled(Box)({
  display: 'inline-flex',
  flexShrink: 0,
  width: 20,
  height: 20,
});

export const LIDropdownLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: theme.semantic.text.primary,
  flex: 1,
  textAlign: 'left',
}));

export const getPopoverPaperStyles = (theme: Theme, darkMode: boolean) => ({
  border: `1px solid ${theme.semantic.divider}`,
  boxShadow: darkMode
    ? '0 4px 12px rgba(0,0,0,0.4), 0 12px 28px rgba(0,0,0,0.35)'
    : theme.customShadows.lg,
  borderRadius: theme.customBorderRadius.xl,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: theme.customSpacing[2],
  width: 288,
  paddingTop: theme.customSpacing[5],
  paddingBottom: theme.customSpacing[4],
  paddingLeft: theme.customSpacing[4],
  paddingRight: theme.customSpacing[4],
  marginTop: theme.customSpacing[1],
  ...(!darkMode && { bgcolor: theme.semantic.common.white }),
});

export const LIProfileHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[2],
  alignItems: 'center',
  paddingBottom: theme.customSpacing[2],
}));

export const LIProfileTextCol = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  alignItems: 'center',
  width: '100%',
});

export const LIProfileNameText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
  textAlign: 'center',
}));

export const LIProfileEmailText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
  textAlign: 'center',
}));

export const LIDividerBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 0,
  borderTop: `1px solid ${theme.semantic.divider}`,
}));

export const LIMenuItemsBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const getNavDrawerPaperStyles = (theme: Theme) => ({
  width: 320,
  bgcolor: theme.semantic.background.paper,
  boxShadow: theme.customShadows.lg,
});

export const getProfileDrawerPaperStyles = (theme: Theme) => ({
  width: 320,
  bgcolor: theme.semantic.background.paper,
  boxShadow: theme.customShadows.lg,
});

export const LIDrawerColumnBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

export const LIDrawerCloseBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.customSpacing[3],
}));

export const LICloseIconBtn = styled(IconButton)(({ theme }) => ({
  padding: theme.customSpacing[1],
  borderRadius: theme.customBorderRadius.xl,
}));

export const LIDrawerProfileHeaderBox = styled(LIProfileHeaderBox)(({ theme }) => ({
  paddingLeft: theme.customSpacing[4],
  paddingRight: theme.customSpacing[4],
  paddingBottom: theme.customSpacing[4],
}));

export const LIDrawerDividerBox = styled(LIDividerBox)(({ theme }) => ({
  marginLeft: theme.customSpacing[4],
  marginRight: theme.customSpacing[4],
}));

export const LIDrawerMenuItemsBox = styled(LIMenuItemsBox)(({ theme }) => ({
  paddingLeft: theme.customSpacing[2],
  paddingRight: theme.customSpacing[2],
  paddingTop: theme.customSpacing[2],
}));

export const LINavDrawerList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
  padding: theme.customSpacing[3],
}));

export const LINavDrawerItem = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.customSpacing[3],
  width: '100%',
  minHeight: 44,
  padding: `${theme.customSpacing[2]} ${theme.customSpacing[3]}`,
  borderRadius: theme.customBorderRadius.lg,
  color: isActive ? theme.semantic.primary.main : theme.semantic.text.primary,
  backgroundColor: isActive ? theme.semantic.primary.swatch : 'transparent',
  textAlign: 'left',
  '&:hover': {
    backgroundColor: isActive ? theme.semantic.primary.swatch : theme.semantic.action.hover,
  },
}));

export const LINavDrawerItemLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: 'inherit',
}));
