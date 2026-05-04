'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ── Shared field label/error patterns ────────────────────────────────────────

export const FieldLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
}));

export const FieldLabelText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean }>(({ theme, isSmall }) => ({
  ...(isSmall ? theme.customTypography.caption.medium : theme.customTypography.body2.medium),
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const FieldRequiredMark = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSmall',
})<{ isSmall?: boolean } & { component?: React.ElementType }>(({ theme, isSmall }) => ({
  ...(isSmall ? theme.customTypography.caption.medium : theme.customTypography.body2.medium),
  color: theme.semantic.error.main,
  flexShrink: 0,
}));

export const FieldErrorRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
  marginTop: theme.customSpacing[2],
}));

export const FieldErrorText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
}));

// ── Select trigger ────────────────────────────────────────────────────────────

export const SelectTrigger = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isError', 'isOpen', 'isDisabled', 'isBase'].includes(prop as string),
})<{ isError?: boolean; isOpen?: boolean; isDisabled?: boolean; isBase?: boolean } & { component?: React.ElementType }>(
  ({ theme, isError, isOpen, isDisabled, isBase }) => {
    let borderColor: string = theme.semantic.border.default;
    let boxShadow = 'none';
    if (isError && isOpen) { borderColor = theme.semantic.error.main; boxShadow = theme.customShadows.focusError; }
    else if (isError) { borderColor = theme.semantic.error.main; }
    else if (isOpen) { borderColor = theme.semantic.primary.main; boxShadow = theme.customShadows.focusPrimary; }

    return {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: theme.customSpacing[1],
      height: isBase ? theme.inputHeights.base : theme.inputHeights.small,
      backgroundColor: theme.semantic.common.white,
      border: `1px solid ${borderColor}`,
      borderRadius: isBase ? theme.customBorderRadius.xl : theme.customBorderRadius.lg,
      boxShadow,
      transition: 'border-color 0.15s, background-color 0.15s, box-shadow 0.15s',
      paddingTop: isBase ? theme.customSpacing[3] : theme.customSpacing[1],
      paddingBottom: isBase ? theme.customSpacing[3] : theme.customSpacing[1],
      paddingLeft: isBase ? theme.customSpacing['3.5'] : theme.customSpacing[2],
      paddingRight: isBase ? theme.customSpacing[3] : theme.customSpacing[1],
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.6 : 1,
      textAlign: 'left' as const,
      fontFamily: 'inherit',
      '&:focus-visible': {
        outline: `2px solid ${theme.semantic.primary.main}`,
        outlineOffset: '2px',
      },
    };
  }
);

export const SelectChevron = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen?: boolean } & { component?: React.ElementType }>(({ isOpen }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s',
}));

// ── Dropdown popover content ──────────────────────────────────────────────────

export const DropdownOption = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[3],
  paddingBottom: theme.customSpacing[3],
  cursor: 'pointer',
  backgroundColor: 'transparent',
  transition: 'background-color 0.1s',
  '&:hover': { backgroundColor: theme.semantic.action.hover },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '-2px',
  },
  '& .option-text': {
    color: isSelected ? theme.semantic.primary.main : theme.semantic.text.primary,
  },
}));

export const DropdownOptionText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  flex: 1,
}));

// ── Root wrappers ────────────────────────────────────────────────────────────

export const SelectFieldRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const SelectFieldInlineRoot = styled(Box)({
  display: 'inline-flex',
  flexDirection: 'column',
});

// ── Label row with dynamic margin ────────────────────────────────────────────

export const FieldLabelRowSpaced = styled(FieldLabelRow, {
  shouldForwardProp: (prop) => prop !== 'isBase',
})<{ isBase?: boolean }>(({ theme, isBase }) => ({
  marginBottom: isBase ? theme.customSpacing[2] : theme.customSpacing[1],
}));

// ── Listbox wrapper ──────────────────────────────────────────────────────────

export const ListboxWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

// ── Check icon span (default variant) ────────────────────────────────────────

export const CheckIconSpan = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  color: theme.semantic.text.secondary,
}));

// ── Popover check icon span ─────────────────────────────────────────────────

export const PopoverCheckIconSpan = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: theme.customSpacing[2],
  color: theme.semantic.primary.main,
}));

// ── Left icon wrapper ────────────────────────────────────────────────────────

export const LeftIconSpan = styled('span', {
  shouldForwardProp: (prop) => prop !== 'iconSize',
})<{ iconSize: number }>(({ theme, iconSize }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: iconSize,
  height: iconSize,
  flexShrink: 0,
  color: theme.semantic.text.secondary,
}));

// ── Display text ─────────────────────────────────────────────────────────────

export const DisplayText = styled('span', {
  shouldForwardProp: (prop) => !['isBase', 'isPlaceholder'].includes(prop as string),
})<{ isBase?: boolean; isPlaceholder?: boolean }>(({ theme, isBase, isPlaceholder }) => ({
  flex: 1,
  ...(isBase ? theme.customTypography.body1.regular : theme.customTypography.body2.regular),
  color: isPlaceholder ? theme.semantic.text.secondary : theme.semantic.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

// ── Tooltip span (inline) ────────────────────────────────────────────────────

export const InlineTooltipSpan = styled('span')({
  display: 'inline-flex',
  flexShrink: 0,
});

// ── Left icon wrapper (simple flex) ──────────────────────────────────────────

export const LeftIconFlexSpan = styled('span')({
  display: 'flex',
  flexShrink: 0,
});

// ── Outline variant trigger ──────────────────────────────────────────────────

export const OutlineTrigger = styled('button', {
  shouldForwardProp: (prop) =>
    !['isOpen', 'isDisabled', 'outlineBorderColor', 'outlineShadow'].includes(prop as string),
})<{
  isOpen?: boolean;
  isDisabled?: boolean;
  outlineBorderColor?: string;
  outlineShadow?: string;
}>(({ theme, isDisabled, outlineBorderColor, outlineShadow }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.customSpacing[1],
  height: theme.inputHeights.base,
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[3],
  paddingBottom: theme.customSpacing[3],
  backgroundColor: 'transparent',
  color: theme.semantic.text.primary,
  border: `1px solid ${outlineBorderColor}`,
  borderRadius: theme.customBorderRadius.xl,
  boxShadow: outlineShadow,
  fontSize: '16px',
  lineHeight: 1,
  fontWeight: 400,
  letterSpacing: '0',
  fontFamily: 'inherit',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(theme.textTrim as Record<string, string>),
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
  ...(!isDisabled && {
    '&:hover': { backgroundColor: theme.semantic.action.hover },
  }),
}));

// ── Outline display text ─────────────────────────────────────────────────────

export const OutlineDisplayText = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isPlaceholder',
})<{ isPlaceholder?: boolean }>(({ theme, isPlaceholder }) => ({
  fontSize: '16px',
  lineHeight: 1,
  fontWeight: 400,
  color: isPlaceholder ? theme.semantic.text.secondary : theme.semantic.text.primary,
  whiteSpace: 'nowrap',
}));

// ── Outline chevron span ─────────────────────────────────────────────────────

export const OutlineChevronSpan = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen?: boolean }>(({ theme, isOpen }) => ({
  display: 'inline-flex',
  // ChevronDownIcon inside uses color="currentColor" — anchor a semantic color
  // here so it flips in dark mode.
  color: theme.semantic.text.secondary,
  transform: isOpen ? 'rotate(180deg)' : 'none',
  transition: 'transform 0.2s ease',
}));

// ── Outline dropdown option ──────────────────────────────────────────────────

export const OutlineDropdownOption = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  width: '100%',
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  border: 'none',
  backgroundColor: isSelected ? theme.semantic.primary.swatch : 'transparent',
  cursor: 'pointer',
  textAlign: 'left' as const,
  fontFamily: 'inherit',
  '&:hover': {
    backgroundColor: isSelected ? theme.semantic.primary.swatch : theme.semantic.action.hover,
  },
}));

// ── Outline dropdown option text ─────────────────────────────────────────────

export const OutlineDropdownOptionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  ...theme.customTypography.body2.regular,
  color: isSelected ? theme.semantic.primary.main : theme.semantic.text.primary,
  fontWeight: isSelected ? theme.fontWeights.medium : theme.fontWeights.regular,
  flex: 1,
}));

// ── Ghost variant trigger ────────────────────────────────────────────────────

export const GhostTrigger = styled('button', {
  shouldForwardProp: (prop) =>
    !['isBase', 'isDisabled', 'isPlaceholder'].includes(prop as string),
})<{
  isBase?: boolean;
  isDisabled?: boolean;
  isPlaceholder?: boolean;
}>(({ theme, isBase, isDisabled, isPlaceholder }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  background: 'none',
  border: 'none',
  // Small padding + rounded corners give the ghost trigger a visible
  // hover surface so users can tell it's interactive when it's sitting
  // alone in a container (e.g. an in-table DurationField cell). Matches
  // the hover treatment used by TimePickerField's ghost trigger and
  // DurationField's unit button.
  paddingTop: theme.customSpacing[1],
  paddingBottom: theme.customSpacing[1],
  paddingLeft: theme.customSpacing[2],
  paddingRight: theme.customSpacing[2],
  borderRadius: theme.customBorderRadius.default,
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.6 : 1,
  color: isPlaceholder ? theme.semantic.text.secondary : theme.semantic.text.primary,
  ...(isBase ? theme.customTypography.body1.regular : theme.customTypography.body2.regular),
  fontFamily: theme.fontFamilies.body,
  transition: 'background-color 0.15s',
  '&:hover': !isDisabled
    ? { backgroundColor: theme.semantic.action.hover }
    : undefined,
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '2px',
    borderRadius: theme.customBorderRadius.default,
  },
}));

// ── Ghost display text ───────────────────────────────────────────────────────

export const GhostDisplayText = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isBase',
})<{ isBase?: boolean }>(({ theme, isBase }) => ({
  ...(isBase ? theme.customTypography.body1.regular : theme.customTypography.body2.regular),
  color: 'inherit',
  fontFamily: 'inherit',
}));

// ── Ghost chevron span ───────────────────────────────────────────────────────

export const GhostChevronSpan = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen?: boolean }>(({ theme, isOpen }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: theme.semantic.text.secondary,
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s',
}));

// ── Ghost anchor wrapper ─────────────────────────────────────────────────────

export const GhostAnchorWrapper = styled(Box)({
  display: 'inline-flex',
});
