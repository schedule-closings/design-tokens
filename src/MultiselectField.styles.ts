'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/* ------------------------------------------------------------------ */
/*  Shared layout                                                      */
/* ------------------------------------------------------------------ */

export const DefaultRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const GhostRoot = styled(Box)({
  display: 'inline-flex',
  flexDirection: 'column',
});

export const LabelRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isBase',
})<{ isBase?: boolean }>(({ theme, isBase }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  marginBottom: isBase ? theme.customSpacing[2] : theme.customSpacing[1],
  minWidth: 0,
}));

export const LabelText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isBase',
})<{ isBase?: boolean }>(({ theme, isBase }) => ({
  ...(isBase ? theme.customTypography.body2.medium : theme.customTypography.caption.medium),
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const RequiredAsterisk = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isBase',
})<{ isBase?: boolean; component?: React.ElementType }>(({ theme, isBase }) => ({
  ...(isBase ? theme.customTypography.body2.medium : theme.customTypography.caption.medium),
  color: theme.semantic.error.main,
  flexShrink: 0,
}));

/* ------------------------------------------------------------------ */
/*  Popover dropdown internals                                         */
/* ------------------------------------------------------------------ */

export const OptionsListGap = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[4],
}));

/* ------------------------------------------------------------------ */
/*  Ghost variant                                                      */
/* ------------------------------------------------------------------ */

export const GhostAnchorWrap = styled(Box)({
  display: 'inline-flex',
});

export const GhostTriggerButton = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isDisabled', 'isPlaceholder', 'isBase'].includes(prop as string),
})<{ isDisabled?: boolean; isPlaceholder?: boolean; isBase?: boolean; disabled?: boolean; component?: React.ElementType }>(
  ({ theme, isDisabled, isPlaceholder, isBase }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.customSpacing[1],
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    color: isPlaceholder ? theme.semantic.text.secondary : theme.semantic.text.primary,
    ...(isBase ? theme.customTypography.body1.regular : theme.customTypography.body2.regular),
    fontFamily: theme.fontFamilies.body,
    '&:focus-visible': {
      outline: `2px solid ${theme.semantic.primary.main}`,
      outlineOffset: '2px',
      borderRadius: theme.customBorderRadius.default,
    },
  })
);

export const GhostDisplayText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isBase',
})<{ isBase?: boolean; component?: React.ElementType }>(({ theme, isBase }) => ({
  ...(isBase ? theme.customTypography.body1.regular : theme.customTypography.body2.regular),
  color: 'inherit',
  fontFamily: 'inherit',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const GhostChevronIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen?: boolean; component?: React.ElementType }>(({ theme, isOpen }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: theme.semantic.text.secondary,
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s',
}));

/* ------------------------------------------------------------------ */
/*  Default variant trigger                                             */
/* ------------------------------------------------------------------ */

export const MultiSelectTrigger = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isOpen', 'isDisabled', 'isBase'].includes(prop as string),
})<{ isOpen?: boolean; isDisabled?: boolean; isBase?: boolean; component?: React.ElementType }>(
  ({ theme, isOpen, isDisabled, isBase }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: theme.customSpacing[1],
    height: isBase ? theme.inputHeights.base : theme.inputHeights.small,
    // Always use the paper surface token so the trigger flips with color mode.
    // Open-state is signalled by border color + focus shadow (matches
    // SelectField / TextInputField / TextareaField); no hardcoded light-gray
    // bg that broke in dark mode.
    backgroundColor: theme.semantic.common.white,
    border: `1px solid ${isOpen ? theme.semantic.primary.main : theme.semantic.border.default}`,
    boxShadow: isOpen ? theme.customShadows.focusPrimary : 'none',
    borderRadius: isBase ? theme.customBorderRadius.xl : theme.customBorderRadius.lg,
    transition: 'border-color 0.15s, box-shadow 0.15s',
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
  })
);

export const MultiSelectChevron = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen?: boolean; component?: React.ElementType }>(({ theme, isOpen }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  // Inherited by the ChevronDownIcon below (color="currentColor"). Semantic
  // token so it auto-flips in dark mode; previously unset which rendered the
  // chevron near-invisible against the dark trigger surface.
  color: theme.semantic.text.secondary,
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s',
}));

export const MultiSelectOption = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.semantic.action.hover },
}));

/* ------------------------------------------------------------------ */
/*  Trigger inner elements                                             */
/* ------------------------------------------------------------------ */

export const TriggerDisplayText = styled(Typography, {
  shouldForwardProp: (prop) =>
    !['isPlaceholder', 'isBase'].includes(prop as string),
})<{ isPlaceholder?: boolean; isBase?: boolean; component?: React.ElementType }>(
  ({ theme, isPlaceholder, isBase }) => ({
    flex: 1,
    // min-width: 0 lets the flex child shrink below its intrinsic text width so
    // the ellipsis actually kicks in when the trigger is narrower than the
    // content.
    minWidth: 0,
    ...(isBase ? theme.customTypography.body1.regular : theme.customTypography.body2.regular),
    color: isPlaceholder ? theme.semantic.text.secondary : theme.semantic.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  })
);

/**
 * OverflowCountBadge - small pill shown in the trigger when selected labels
 * overflow the available width, e.g. "+3". Keeps the trigger width bounded
 * while still showing as many full labels as will fit.
 */
export const OverflowCountBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  minWidth: 28,
  height: 22,
  padding: `0 ${theme.customSpacing[2]}`,
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: theme.semantic.action.selected,
  color: theme.semantic.text.primary,
  ...theme.customTypography.body2.medium,
  lineHeight: 1,
}));

/**
 * HiddenMeasureRow - off-screen copy of the selected labels + the overflow
 * badge, used purely for offsetWidth measurement. Kept in-flow with
 * `visibility: hidden` so it inherits the live trigger typography. Pointer
 * events are disabled so it can't steal clicks.
 */
export const HiddenMeasureRow = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  ...theme.customTypography.body1.regular,
}));

export const TriggerTrailingIcons = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  gap: theme.customSpacing[1],
}));

export const SelectedCountText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isBase',
})<{ isBase?: boolean; component?: React.ElementType }>(({ theme, isBase }) => ({
  ...(isBase ? theme.customTypography.body1.regular : theme.customTypography.body2.regular),
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
}));

export const InlineTooltipWrap = styled(Box)<{ component?: React.ElementType }>({
  display: 'inline-flex',
  flexShrink: 0,
});

/* ------------------------------------------------------------------ */
/*  Sectioned dropdown (used when `searchable` or any option has a     */
/*  leading badge). Outer SmoothBox drops its padding so these         */
/*  sections can own their own spacing and a real sticky/scroll        */
/*  boundary; search section stays pinned, options list scrolls.       */
/* ------------------------------------------------------------------ */

// Sticky search section at the top of the dropdown. Does NOT scroll;
// it sits above the scrollable options list and is visually separated
// by a slate/200 border. Always renders at base sizing regardless of
// the field's trigger size so the input stays comfortable to type in.
export const DropdownSearchSection = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  padding: theme.customSpacing[4],
  borderBottom: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.high,
}));

// Scrollable options list section. Owns its own padding + vertical
// scroll; the outer dropdown clips overflow so scrollbars stay inside
// this section (not on the whole dropdown).
export const DropdownOptionsSection = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.customSpacing[4],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
}));

// Clickable option row with checkbox + optional leading badge + label.
// Replaces the legacy Checkbox-with-label rendering when options use
// `badge` or when the dropdown is `searchable`. Uses spacing[2] (8px)
// between children so the gap between badge and label lands at 8px to
// match the Figma reference.
export const DropdownOptionRow = styled('button')(({ theme }) => ({
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  width: '100%',
  borderRadius: theme.customBorderRadius.default,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.semantic.action.hover,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: -2,
  },
}));

// Numeric / "ALL" pill on the left of an option row. Styled per Figma:
// slate/200 bg, rounded-default (4px), overline typography (10px semibold
// uppercase with 0.4px letter-spacing), padding-block 4px. Fixed 28px
// width so labels align across options regardless of badge content.
export const DropdownOptionBadge = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: 28,
  paddingBlock: theme.customSpacing[1],
  borderRadius: theme.customBorderRadius.default,
  backgroundColor: theme.colors.slate[200],
  color: theme.semantic.text.secondary,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...theme.customTypography.overline,
}));

export const DropdownOptionLabel = styled(Box)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: theme.semantic.text.primary,
  flex: 1,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const DropdownEmptyMessage = styled(Box)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
  textAlign: 'center',
  padding: `${theme.customSpacing[4]} ${theme.customSpacing[2]}`,
}));
