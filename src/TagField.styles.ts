'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

export const TagFieldWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const TagFieldLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
  marginBottom: theme.customSpacing[2],
}));

export const TagFieldLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const TagFieldRequiredMark = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
  flexShrink: 0,
}));

export const TagInputBox = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isError', 'isFocused', 'isDisabled', 'isSmall', 'isCollapsed', 'isOverlay'].includes(
      prop as string,
    ),
})<{
  isError?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  isSmall?: boolean;
  isCollapsed?: boolean;
  /**
   * When true (dropdown variant + focused), the box detaches from layout
   * flow and floats as an absolute-positioned overlay above sibling fields.
   * A `TagFieldDropdownSpacer` renders in its original slot so nothing below
   * shifts when chips wrap to multiple rows.
   */
  isOverlay?: boolean;
}>(({ theme, isError, isFocused, isDisabled, isSmall, isCollapsed, isOverlay }) => {
  let borderColor: string = theme.colors.gray[500];
  let boxShadow = 'none';
  if (isDisabled) { borderColor = theme.colors.gray[300]; }
  else if (isError && isFocused) { borderColor = theme.semantic.error.main; boxShadow = theme.customShadows.focusError; }
  else if (isError) { borderColor = theme.semantic.error.main; }
  else if (isFocused) { borderColor = theme.semantic.primary.main; boxShadow = theme.customShadows.focusPrimary; }

  return {
    display: 'flex',
    alignItems: 'center',
    flexWrap: isCollapsed ? 'nowrap' as const : 'wrap' as const,
    overflow: isCollapsed ? 'hidden' : 'visible',
    gap: theme.customSpacing[1],
    backgroundColor: theme.semantic.common.white,
    borderRadius: isSmall ? theme.customBorderRadius.lg : theme.customBorderRadius.xl,
    border: `1px solid ${borderColor}`,
    boxShadow,
    transition: 'border-color 0.15s, box-shadow 0.15s',
    paddingLeft: isSmall ? theme.customSpacing['2.5'] : theme.customSpacing[3],
    paddingRight: isSmall ? theme.customSpacing['2.5'] : theme.customSpacing[3],
    paddingTop: isSmall ? theme.customSpacing[1] : theme.customSpacing[2],
    paddingBottom: isSmall ? theme.customSpacing[1] : theme.customSpacing[2],
    cursor: isDisabled ? 'not-allowed' : 'text',
    opacity: isDisabled ? 0.6 : 1,
    minHeight: isSmall ? theme.inputHeights.small : theme.inputHeights.base,
    boxSizing: 'border-box' as const,
    // Float as overlay (dropdown variant, focused): same width as the flow
    // slot the spacer now occupies. zIndex outranks surrounding field
    // elements so chips wrap over them rather than being clipped.
    ...(isOverlay && {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    }),
  };
});

/**
 * Phantom spacer rendered in place of the TagInputBox while the dropdown
 * variant's overlay is open. Preserves the original single-row height so
 * surrounding fields don't jump when chips spill onto additional rows.
 */
export const TagFieldDropdownSpacer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  height: isSmall ? theme.inputHeights.small : theme.inputHeights.base,
  pointerEvents: 'none',
}));

export const TagInput = styled(InputBase, {
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

export const TagFieldErrorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const TagFieldErrorText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
}));

export const TagOverflowWrap = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean; component?: React.ElementType }>(({ theme, isSmall }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  // Align the +N badge height with the tag-mode chips sitting next to it.
  // Tag-mode chips use 2px vertical padding (4px compact) and no border; the
  // underlying duotone chip uses 4px padding (2px compact) plus a 1px
  // transparent border, which left the badge 6px taller than its neighbors.
  // Override both so every chip in the field is the same height.
  '&& > *': {
    paddingTop: isSmall ? theme.customSpacing[1] : theme.customSpacing[0.5],
    paddingBottom: isSmall ? theme.customSpacing[1] : theme.customSpacing[0.5],
    border: 'none',
  },
}));

/* ---- OverflowBadge sub-component styles ---- */

export const TooltipColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
}));

export const TooltipValueText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.common.white,
}));

/* ---- Container & measurement styles ---- */

export const TagFieldContainerBox = styled(Box)(() => ({
  position: 'relative',
}));

export const TagFieldInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => !['isSmall', 'isCollapsed'].includes(prop as string),
})<{ isSmall?: boolean; isCollapsed?: boolean }>(({ theme, isSmall, isCollapsed }) => ({
  ...(isCollapsed
    ? { position: 'absolute' as const, opacity: 0, width: 0, height: 0, pointerEvents: 'none' as const }
    : { flex: '1 0 120px', minWidth: 120 }),
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

export const TagFieldPlaceholderText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: theme.semantic.text.secondary,
  flex: 1,
}));

export const TagFieldMeasureRow = styled(Box)(({ theme }) => ({
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

export const TagFieldMeasureChip = styled(Box)(() => ({
  flexShrink: 0,
}));

export const TagFieldMeasureBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  flexShrink: 0,
  // Mirror the override in TagOverflowWrap so the hidden measure chip has
  // the same width as the visible +N badge. Keeps the overflow calculation
  // accurate after the badge was shrunk to match tag-mode chip height.
  '&& > *': {
    paddingTop: isSmall ? theme.customSpacing[1] : theme.customSpacing[0.5],
    paddingBottom: isSmall ? theme.customSpacing[1] : theme.customSpacing[0.5],
    border: 'none',
  },
}));
