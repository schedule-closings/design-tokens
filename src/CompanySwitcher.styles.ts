'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

export const CSwitcherRoot = styled(Box)({
  position: 'relative',
});

export const CSwitcherTrigger = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[2],
  alignItems: 'center',
  cursor: 'pointer',
}));

// 48px rounded-square icon box for "All Companies"
export const CSwitcherAllIconBox = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: `${Math.round(48 * 0.25)}px`,
  backgroundColor: theme.semantic.background.paper,
  border: `1px solid ${theme.semantic.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

export const CSwitcherNameCol = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
}));

export const CSwitcherNameRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
}));

export const CSwitcherChevronBox = styled(Box)({
  flexShrink: 0,
  display: 'inline-flex',
});

export const CSwitcherNameText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const CSwitcherViewLink = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isAllSelected',
})<{ isAllSelected?: boolean }>(({ theme, isAllSelected }) => ({
  ...theme.customTypography.body2.medium,
  color: isAllSelected ? theme.semantic.text.disabled : theme.semantic.primary.main,
  cursor: isAllSelected ? 'default' : 'pointer',
}));

// Dropdown option row (shared for "All Companies", company entries, and "Add Company")
export const CSwitcherOption = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  gap: theme.customSpacing[2],
  alignItems: 'center',
  padding: theme.customSpacing[2],
  borderRadius: theme.customBorderRadius.lg,
  width: '100%',
  height: 48,
  justifyContent: 'flex-start',
  backgroundColor: isSelected ? theme.semantic.primary.swatch : 'transparent',
  '[data-color-mode="dark"] &': {
    backgroundColor: isSelected ? theme.semantic.action.selected : 'transparent',
  },
  '&:hover': { backgroundColor: isSelected ? undefined : theme.semantic.action.hover },
}));

// 32px rounded-square icon box inside dropdown (All Companies)
export const CSwitcherSmallAllBox = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: `${Math.round(32 * 0.25)}px`,
  backgroundColor: theme.semantic.background.paper,
  border: `1px solid ${theme.semantic.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

// Company / "All Companies" label inside dropdown
export const CSwitcherOptionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  ...(isSelected ? theme.customTypography.body1.medium : theme.customTypography.body1.regular),
  color: isSelected ? theme.semantic.primary.dark : theme.semantic.text.secondary,
  flex: 1,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

// 32px primary-swatch icon box for "Add Company"
export const CSwitcherAddIconBox = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: `${Math.round(32 * 0.25)}px`,
  backgroundColor: theme.semantic.primary.swatch,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

export const CSwitcherAddText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: theme.semantic.primary.main,
}));

// Add Company action row (no selection state)
export const CSwitcherAddOption = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[2],
  alignItems: 'center',
  padding: theme.customSpacing[2],
  borderRadius: theme.customBorderRadius.lg,
  width: '100%',
  justifyContent: 'flex-start',
  '&:hover': { backgroundColor: theme.semantic.action.hover },
}));
