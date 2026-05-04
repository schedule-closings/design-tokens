'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

export const ProfileSwitcherChip = styled(ButtonBase, {
  shouldForwardProp: (prop) => !['open', 'impersonated'].includes(prop as string),
})<{ open?: boolean; impersonated?: boolean }>(({ theme, open, impersonated }) => {
  const isActive = Boolean(open) && !impersonated;
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.customSpacing[1],
    width: '100%',
    paddingLeft: theme.customSpacing[3],
    paddingRight: theme.customSpacing[3],
    paddingTop: theme.customSpacing[2],
    paddingBottom: theme.customSpacing[2],
    borderRadius: theme.customBorderRadius.xl,
    border: `1px solid ${isActive ? theme.colors.blue[200] : theme.colors.slate[300]}`,
    backgroundColor: isActive ? theme.colors.blue[50] : theme.semantic.common.white,
    color: isActive ? theme.colors.blue[900] : theme.colors.slate[600],
    transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
    '&:hover': {
      backgroundColor: isActive ? theme.colors.blue[100] : theme.colors.slate[100],
    },
    '&.Mui-disabled': {
      opacity: 1,
      color: theme.colors.slate[600],
    },
    '[data-color-mode="dark"] &': {
      backgroundColor: isActive
        ? `color-mix(in srgb, ${theme.colors.blue[500]} 20%, transparent)`
        : theme.colors.slate[900],
      borderColor: isActive ? theme.colors.blue[700] : theme.colors.slate[600],
      color: isActive ? theme.colors.blue[100] : theme.colors.slate[300],
    },
  };
});

export const ProfileSwitcherLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  flex: 1,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'inherit',
}));

export const ProfileSwitcherListRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  outline: 'none',
  width: '100%',
});

export const ProfileSwitcherItem = styled(ButtonBase, {
  shouldForwardProp: (prop) => !['isSelected', 'isChild'].includes(prop as string),
})<{ isSelected?: boolean; isChild?: boolean }>(({ theme, isSelected, isChild }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.customSpacing[1],
  width: '100%',
  paddingLeft: isChild ? theme.customSpacing[6] : theme.customSpacing[3],
  paddingRight: theme.customSpacing[2],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  borderRadius: theme.customBorderRadius.lg,
  textAlign: 'left',
  ...theme.customTypography.body1.regular,
  color: isSelected ? theme.semantic.primary.main : theme.semantic.text.primary,
  backgroundColor: isSelected ? theme.colors.blue[50] : 'transparent',
  '&:hover': {
    backgroundColor: isSelected ? theme.colors.blue[100] : theme.semantic.action.hover,
  },
  '[data-color-mode="dark"] &': {
    color: isSelected ? theme.colors.blue[200] : theme.semantic.text.primary,
    backgroundColor: isSelected
      ? `color-mix(in srgb, ${theme.colors.blue[500]} 20%, transparent)`
      : 'transparent',
    '&:hover': {
      backgroundColor: isSelected
        ? `color-mix(in srgb, ${theme.colors.blue[500]} 28%, transparent)`
        : theme.semantic.action.hover,
    },
  },
}));

export const ProfileSwitcherGroup = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'forceExpanded',
})<{ forceExpanded?: boolean }>(({ theme, forceExpanded }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  borderRadius: theme.customBorderRadius.lg,
  transition: 'background-color 120ms ease',
  '& .profile-switcher-children': {
    display: forceExpanded ? 'flex' : 'none',
    flexDirection: 'column',
    gap: 0,
  },
  ...(forceExpanded && {
    backgroundColor: theme.colors.blue[50],
  }),
  '&:hover, &:focus-within': {
    backgroundColor: forceExpanded ? theme.colors.blue[50] : theme.semantic.action.hover,
    '& .profile-switcher-children': {
      display: 'flex',
    },
  },
  '[data-color-mode="dark"] &': {
    ...(forceExpanded && {
      backgroundColor: `color-mix(in srgb, ${theme.colors.blue[500]} 18%, transparent)`,
    }),
  },
  '[data-color-mode="dark"] &:hover, [data-color-mode="dark"] &:focus-within': {
    backgroundColor: forceExpanded
      ? `color-mix(in srgb, ${theme.colors.blue[500]} 18%, transparent)`
      : theme.semantic.action.hover,
  },
}));

export const ProfileSwitcherGroupHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  width: '100%',
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[2],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  textAlign: 'left',
  ...theme.customTypography.body1.regular,
  color: theme.semantic.text.primary,
}));

export const ProfileSwitcherGroupChildren = styled(Box)({});

export const ProfileSwitcherItemLabel = styled(Box)({
  flex: 1,
  display: 'flex',
  gap: 4,
  alignItems: 'baseline',
});

export const ProfileSwitcherItemCount = styled('span')(({ theme }) => ({
  color: theme.semantic.text.disabled,
}));

export const ProfileSwitcherFooterAction = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.customSpacing[1],
  width: '100%',
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[2],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  borderRadius: theme.customBorderRadius.lg,
  textAlign: 'left',
  ...theme.customTypography.body1.regular,
  color: theme.semantic.primary.main,
  '&:hover': {
    backgroundColor: theme.semantic.action.hover,
  },
}));
