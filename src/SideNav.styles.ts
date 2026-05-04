'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

// ── Toggle chevron button ──────────────────────────────────────

export const NavToggleButton = styled(ButtonBase)(({ theme }) => ({
  position: 'absolute',
  right: -12,
  top: 20,
  width: 24,
  height: 24,
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.base,
  border: `1px solid ${theme.semantic.divider}`,
  boxShadow: theme.customShadows.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 4,
  '&:hover': { backgroundColor: theme.semantic.action.hover },
}));

// ── Expanded nav item ──────────────────────────────────────────

export const NavItemExpandedBtn = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  // CSS var set on parent in SideNav root — light: blue[50], dark: action.selected
  '--sc-sidenav-active-bg': theme.colors.blue[50],
  '[data-color-mode="dark"] &': {
    '--sc-sidenav-active-bg': theme.semantic.action.selected,
  },
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  width: '100%',
  paddingLeft: theme.customSpacing[2],
  paddingRight: theme.customSpacing[2],
  paddingTop: theme.customSpacing[3],
  paddingBottom: theme.customSpacing[3],
  borderRadius: theme.customBorderRadius.xl,
  backgroundColor: isActive ? 'var(--sc-sidenav-active-bg, ' + theme.colors.blue[50] + ')' : 'transparent',
  position: 'relative',
  justifyContent: 'flex-start',
  transition: 'background-color 0.15s',
  '&:hover': {
    backgroundColor: isActive
      ? 'var(--sc-sidenav-active-bg, ' + theme.colors.blue[50] + ')'
      : theme.semantic.action.hover,
  },
}));

export const NavItemIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  width: 20,
  height: 20,
  color: isActive ? theme.semantic.primary.main : theme.semantic.text.secondary,
}));

export const NavItemLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  ...(isActive ? theme.customTypography.body1.medium : theme.customTypography.body1.regular),
  lineHeight: 1,
  color: isActive ? theme.semantic.primary.main : theme.semantic.text.primary,
  flex: 1,
  textAlign: 'left',
}));

// ── Collapsed nav item ─────────────────────────────────────────

export const NavItemCollapsedBtn = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  '--sc-sidenav-active-bg': theme.colors.blue[50],
  '[data-color-mode="dark"] &': {
    '--sc-sidenav-active-bg': theme.semantic.action.selected,
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  padding: theme.customSpacing[3],
  borderRadius: theme.customBorderRadius.xl,
  backgroundColor: isActive ? 'var(--sc-sidenav-active-bg, ' + theme.colors.blue[50] + ')' : 'transparent',
  transition: 'background-color 0.15s',
  '&:hover': {
    backgroundColor: isActive
      ? 'var(--sc-sidenav-active-bg, ' + theme.colors.blue[50] + ')'
      : theme.semantic.action.hover,
  },
}));

export const NavItemCollapsedIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'inline-flex',
  width: 20,
  height: 20,
  color: isActive ? theme.semantic.primary.main : theme.semantic.text.secondary,
}));

// ── Impersonation banner ───────────────────────────────────────

export const ImpersonationBannerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[3],
  width: '100%',
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[3],
  paddingBottom: theme.customSpacing[3],
  borderRadius: theme.customBorderRadius.xl,
  backgroundColor: theme.colors.red[50],
  border: `1px solid ${theme.semantic.error.main}`,
  '[data-color-mode="dark"] &': {
    backgroundColor: `color-mix(in srgb, ${theme.colors.red[500]} 10%, transparent)`,
    borderColor: theme.semantic.error.dark,
  },
}));

export const ImpersonationTextCol = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0,
  textAlign: 'center',
});

export const ImpersonationAdminLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.overline,
  color: theme.semantic.text.secondary,
}));

export const ImpersonationAdminName = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: theme.colors.red[700],
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '[data-color-mode="dark"] &': {
    color: theme.colors.red[300],
  },
}));

export const ImpersonationExitBox = styled(Box)({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'scaleX(-1)',
});

// ── Setup card ─────────────────────────────────────────────────

export const SetupCardTitle = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
  textAlign: 'center',
  width: '100%',
}));

export const SetupProgressBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0,
  width: '100%',
}));

/**
 * Inline row that pairs the "N of X" readout with the info-tooltip trigger so
 * the icon sits next to the number (not on a separate line).
 */
export const SetupProgressNumberRow = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
}));

export const SetupProgressNumber = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.h6.semibold,
  color: theme.semantic.text.primary,
}));

export const SetupProgressLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.overline,
  color: theme.semantic.text.secondary,
  textAlign: 'center',
}));

export const SetupDotsRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export const SetupDotIconBox = styled(Box)({
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

/**
 * Interactive variant of the setup dot — used when the banner mirrors real
 * checklist items so each dot is clickable (opens its sub-modal) with a
 * tooltip on hover. Resets browser button defaults and adds a subtle hover
 * affordance matching the dot icon size.
 */
export const SetupDotInteractiveBtn = styled(ButtonBase)(({ theme }) => ({
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  padding: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: theme.customBorderRadius.full,
  cursor: 'pointer',
  transition: 'transform 120ms ease, background-color 120ms ease',
  '&:hover': {
    backgroundColor: theme.semantic.action.hover,
    transform: 'scale(1.1)',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: 2,
  },
}));

export const SetupButton = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: theme.customSpacing[2],
  borderRadius: theme.customBorderRadius.lg,
  backgroundColor: theme.colors.yellow[100],
  color: theme.semantic.alert.dark,
  ...theme.customTypography.body2.regular,
  transition: 'background-color 150ms ease',
  '&:hover': {
    backgroundColor: theme.colors.yellow[200],
  },
  '[data-color-mode="dark"] &': {
    backgroundColor: `color-mix(in srgb, ${theme.colors.yellow[500]} 18%, transparent)`,
    color: theme.colors.yellow[200],
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.yellow[500]} 28%, transparent)`,
    },
  },
}));

// ── View Staff chip ────────────────────────────────────────────

export const ViewStaffBtn = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.customSpacing[1],
  width: '100%',
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  backgroundColor: theme.semantic.action.hover,
  borderRadius: theme.customBorderRadius.lg,
  '&:hover': { backgroundColor: theme.semantic.action.selected },
}));

export const ViewStaffLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.primary,
}));

// ── Profile row ────────────────────────────────────────────────

export const ProfileRowBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[2],
  alignItems: 'center',
  width: '100%',
  height: 48,
}));

export const ProfileTextCol = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  justifyContent: 'center',
});

export const ProfileNameText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const ProfileRoleText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

// ── Company section ────────────────────────────────────────────

export const CompanySectionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[2],
  alignItems: 'center',
  width: '100%',
}));

export const CompanyTextCol = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
}));

export const CompanyNameBtn = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  justifyContent: 'flex-start',
  borderRadius: theme.customBorderRadius.xl,
  width: '100%',
}));

export const CompanyNameText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const CompanyViewLinkRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
}));

export const CompanyViewLink = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.primary.main,
  cursor: 'pointer',
}));

// ── Customer top section ───────────────────────────────────────

export const CustomerTopBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
  alignItems: 'center',
  width: '100%',
}));

export const CustomerAvatarRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[2],
  alignItems: 'center',
  width: '100%',
}));

export const CustomerTextCol = styled(Box)({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const CustomerNameText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const CustomerViewLink = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.primary.main,
  cursor: 'pointer',
}));

// ── Individual profile selector
// (moved to ProfileSwitcherField.styles.ts — a SelectField-derived dropdown
// used exclusively by the SideNav Individual account top section)

// ── Divider ────────────────────────────────────────────────────

export const NavDivider = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 0,
  borderTop: `1px solid ${theme.semantic.divider}`,
}));

// ── Footer ─────────────────────────────────────────────────────

export const SideNavFooterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
  width: '100%',
  flexShrink: 0,
  textAlign: 'center',
}));

export const SideNavVersionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<{ isClickable?: boolean }>(({ theme, isClickable }) => ({
  ...theme.customTypography.overline,
  color: theme.semantic.text.secondary,
  ...(isClickable && {
    cursor: 'pointer',
    transition: 'color 0.15s',
    '&:hover': { color: theme.semantic.primary.main },
  }),
}));

export const SideNavLegalText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: theme.fontWeights.regular,
  lineHeight: '16px',
  color: theme.semantic.text.secondary,
}));

// ── Collapsed impersonation ring ───────────────────────────────

export const CollapsedAdminRing = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: theme.customBorderRadius.full,
  border: `2px solid ${theme.semantic.error.main}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const CollapsedImpersonationCol = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[2],
  alignItems: 'center',
  flexShrink: 0,
}));

// ── Root nav container ────────────────────────────────────────

export const SideNavRoot = styled(Box, {
  shouldForwardProp: (prop) => !['isExpanded', 'isAnimating'].includes(prop as string),
})<{ isExpanded?: boolean; isAnimating?: boolean } & { component?: React.ElementType }>(({ theme, isExpanded, isAnimating }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[4],
  alignItems: 'center',
  padding: theme.customSpacing[6],
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.base,
  position: 'relative',
  width: isExpanded ? 320 : 96,
  minHeight: 640,
  height: '100%',
  transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
  overflow: isAnimating ? 'hidden' : 'visible',
  flexShrink: 0,
}));

// ── Collapsed nav item wrappers ───────────────────────────────

export const CollapsedItemRelativeBox = styled(Box)({
  position: 'relative',
});

export const CollapsedBadgePosition = styled(Box)({
  position: 'absolute',
  top: -4,
  right: -4,
});

// ── Content panels (expanded / collapsed) ─────────────────────

export const SideNavExpandedPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAnimating',
})<{ isAnimating?: boolean }>(({ theme, isAnimating }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[4],
  alignItems: 'center',
  width: 320 - 48,    // EXPANDED_WIDTH - padding
  minWidth: 320 - 48,
  flex: 1,
  minHeight: 0,
  opacity: isAnimating ? 0 : 1,
  transition: 'opacity 0.2s ease',
}));

export const SideNavCollapsedPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAnimating',
})<{ isAnimating?: boolean }>(({ theme, isAnimating }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[4],
  alignItems: 'center',
  width: 96 - 48,     // COLLAPSED_WIDTH - padding
  minWidth: 96 - 48,
  flex: 1,
  minHeight: 0,
  opacity: isAnimating ? 0 : 1,
  transition: 'opacity 0.2s ease',
}));

export const SideNavNavList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
  flex: 1,
  width: '100%',
  minHeight: 0,
}));

export const SideNavCollapsedNavList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
  flex: 1,
  alignItems: 'center',
  minHeight: 0,
}));

export const SideNavTopSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[4],
  alignItems: 'center',
  width: '100%',
  flexShrink: 0,
}));
