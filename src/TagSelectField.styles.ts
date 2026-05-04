'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

export const TagSelectWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const TagSelectLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
  marginBottom: theme.customSpacing[2],
}));

export const TagSelectLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const TagSelectRequiredMark = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
  flexShrink: 0,
}));

export const TagSelectInputBox = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isError', 'isFocused', 'isDisabled', 'isSmall', 'isCollapsed'].includes(prop as string),
})<{ isError?: boolean; isFocused?: boolean; isDisabled?: boolean; isSmall?: boolean; isCollapsed?: boolean }>(
  ({ theme, isError, isFocused, isDisabled, isSmall, isCollapsed }) => {
    let borderColor: string = theme.colors.gray[500];
    let boxShadow = 'none';
    if (isDisabled) { borderColor = theme.colors.gray[300]; }
    else if (isError && isFocused) { borderColor = theme.semantic.error.main; boxShadow = theme.customShadows.focusError; }
    else if (isError) { borderColor = theme.semantic.error.main; }
    else if (isFocused) { borderColor = theme.semantic.primary.main; boxShadow = theme.customShadows.focusPrimary; }

    return {
      display: 'flex',
      alignItems: 'center',
      gap: theme.customSpacing[1],
      backgroundColor: theme.semantic.common.white,
      borderRadius: isSmall ? theme.customBorderRadius.lg : theme.customBorderRadius.xl,
      border: `1px solid ${borderColor}`,
      boxShadow,
      transition: 'border-color 0.15s, box-shadow 0.15s',
      paddingLeft: isSmall ? theme.customSpacing['2.5'] : theme.customSpacing[3],
      paddingRight: isSmall ? theme.customSpacing['1.5'] : theme.customSpacing['1.5'],
      paddingTop: isSmall ? theme.customSpacing[1] : theme.customSpacing[2],
      paddingBottom: isSmall ? theme.customSpacing[1] : theme.customSpacing[2],
      cursor: isDisabled ? 'not-allowed' : 'text',
      opacity: isDisabled ? 0.6 : 1,
      minHeight: isSmall ? theme.inputHeights.small : theme.inputHeights.base,
      boxSizing: 'border-box' as const,
      flexWrap: isCollapsed ? 'nowrap' : 'wrap',
      overflow: isCollapsed ? 'hidden' : 'visible',
    };
  }
);

export const TagSelectInput = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  flex: 1,
  minWidth: 80,
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  lineHeight: 1,
  color: theme.semantic.text.primary,
  '& input': {
    padding: 0,
    color: 'inherit',
    '&::placeholder': { color: theme.semantic.text.secondary, opacity: 1 },
  },
}));

export const TagSelectErrorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const TagSelectErrorText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
}));

export const TagSelectOverflowWrap = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean; component?: React.ElementType }>(({ theme, isSmall }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  // Align the +N badge height with the tag-mode chips sitting next to it.
  // Tag-mode chips use 2px vertical padding (4px compact) and no border; the
  // underlying duotone chip uses 4px padding (2px compact) plus a 1px
  // transparent border, which left the badge 6px taller than its neighbors.
  // Double-&& bumps specificity above the Chip's own class rule.
  '&& > *': {
    paddingTop: isSmall ? theme.customSpacing[1] : theme.customSpacing[0.5],
    paddingBottom: isSmall ? theme.customSpacing[1] : theme.customSpacing[0.5],
    border: 'none',
  },
}));

// Tooltip content.

export const TagSelectTooltipList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
}));

export const TagSelectTooltipItem = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.common.white,
}));

// Container wrappers.

export const TagSelectRelativeBox = styled(Box)({
  position: 'relative',
});

// Input row sub-components.

export const TagSelectFilterInput = styled(InputBase, {
  shouldForwardProp: (prop) => !['isCollapsed', 'isSmall'].includes(prop as string),
})<{ isCollapsed?: boolean; isSmall?: boolean }>(({ theme, isCollapsed, isSmall }) => ({
  ...(isCollapsed
    ? { position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' as const }
    : { flex: '1 0 80px', minWidth: 80 }),
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  lineHeight: 1,
  color: theme.semantic.text.primary,
  '& input': {
    padding: 0,
    color: 'inherit',
    '&::placeholder': { color: theme.semantic.text.secondary, opacity: 1 },
    '&:disabled': { cursor: 'not-allowed' },
  },
}));

export const TagSelectPlaceholder = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: theme.semantic.text.secondary,
  flex: 1,
}));

export const TagSelectChevronBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen?: boolean }>(({ isOpen }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  marginLeft: 'auto',
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s',
}));

// Measurement DOM.

export const TagSelectMeasureRow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: theme.customSpacing[2],
  height: 0,
  overflow: 'hidden',
}));

export const TagSelectMeasureChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  flexShrink: 0,
  // Only the badge measure instance (data-badge) carries the mismatched
  // duotone padding/border; scope the override so regular tag-mode chips
  // (data-chip) stay as-is.
  '&&[data-badge] > *': {
    paddingTop: isSmall ? theme.customSpacing[1] : theme.customSpacing[0.5],
    paddingBottom: isSmall ? theme.customSpacing[1] : theme.customSpacing[0.5],
    border: 'none',
  },
}));

// Dropdown items.

export const TagSelectDropdownList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const TagSelectNoResults = styled(Box)(({ theme }) => ({
  paddingLeft: theme.customSpacing[4],
  paddingRight: theme.customSpacing[4],
  paddingTop: theme.customSpacing[3],
  paddingBottom: theme.customSpacing[3],
}));

export const TagSelectNoResultsText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
}));

export const TagSelectOptionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  paddingLeft: theme.customSpacing[4],
  paddingRight: theme.customSpacing[4],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.semantic.action.hover },
}));

export const TagSelectOptionLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: theme.semantic.text.primary,
}));
