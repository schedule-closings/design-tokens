'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

/**
 * InfoNote styles --- SV Design System
 * Source: Figma file iRAMCNMRIgynOcF4RYVxRz, node 343-1847
 */

/**
 * Outer flex layout.
 * Collapsed --- flex-row (icon+title and "Show more" sit side-by-side).
 * Expanded  --- flex-col (content row above, action links below).
 */
export const InfoNoteLayout = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$collapsed',
})<{ $collapsed?: boolean }>(({ theme, $collapsed }) => ({
  display: 'flex',
  flexDirection: $collapsed ? 'row' : 'column',
  gap: theme.customSpacing[3],
  alignItems: $collapsed ? 'flex-start' : 'flex-end',
  justifyContent: $collapsed ? 'flex-end' : undefined,
  padding: theme.customSpacing[4],
}));

/**
 * Row containing the info icon and text column.
 * Collapsed --- flex-1 so the title stretches and pushes "Show more" right.
 * Expanded  --- full width.
 */
export const InfoNoteContentRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$collapsed',
})<{ $collapsed?: boolean }>(({ theme, $collapsed }) => ({
  display: 'flex',
  gap: theme.customSpacing[3],
  alignItems: 'flex-start',
  ...$collapsed
    ? { flex: '1 0 0', minWidth: 0 }
    : { flexShrink: 0, width: '100%' },
}));

/** Wrapper that prevents the 24px icon from shrinking. $color / $darkColor set the icon color via currentColor so mode stays in sync with CSS. */
export const InfoNoteIconBox = styled(Box, {
  shouldForwardProp: (prop) => !['$color', '$darkColor'].includes(prop as string),
})<{ $color?: string; $darkColor?: string }>(({ $color, $darkColor }) => ({
  flexShrink: 0,
  display: 'flex',
  lineHeight: 0,
  ...($color && { color: $color }),
  ...($darkColor && {
    '[data-color-mode="dark"] &': { color: $darkColor },
  }),
}));

/** Flex column holding title and/or body text */
export const InfoNoteTextCol = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
  flex: '1 0 0',
  minWidth: 0,
}));

/** Bold title --- always shown. $color / $darkColor drive the type-matched accent (CSS-based so it stays in sync with data-color-mode). Title always uses body1.semibold regardless of size. */
export const InfoNoteTitle = styled('p', {
  shouldForwardProp: (prop) => !['$color', '$darkColor'].includes(prop as string),
})<{ $color?: string; $darkColor?: string }>(({ theme, $color, $darkColor }) => ({
  margin: 0,
  ...theme.customTypography.body1.semibold,
  color: $color ?? theme.semantic.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  ...($darkColor && {
    '[data-color-mode="dark"] &': { color: $darkColor },
  }),
}));

/** Body text --- shown when expanded. Same accent color as title/icon at 80% opacity. $size='small' downshifts to body2. */
export const InfoNoteBody = styled('p', {
  shouldForwardProp: (prop) => !['$color', '$darkColor', '$size'].includes(prop as string),
})<{ $color?: string; $darkColor?: string; $size?: 'default' | 'small' }>(({ theme, $color, $darkColor, $size }) => ({
  margin: 0,
  ...($size === 'small' ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: $color ?? theme.semantic.text.primary,
  opacity: 0.8,
  ...($darkColor && {
    '[data-color-mode="dark"] &': { color: $darkColor },
  }),
}));

/**
 * Row of action links.
 * Expanded --- below content, right-aligned (justifyContent: flex-end).
 * Collapsed --- after the content row in the flex-row outer; flexShrink:0 keeps it compact.
 */
export const InfoNoteActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[5],
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  flexShrink: 0,
}));

/**
 * Clickable text link for action buttons.
 * $color='error'    --- always uses error.dark (destructive actions).
 * $color otherwise  --- uses $defaultColor (the note type's accent color), with $darkDefaultColor swapping in under data-color-mode="dark".
 */
export const InfoNoteActionLink = styled('button', {
  shouldForwardProp: (prop) => !['$color', '$defaultColor', '$darkDefaultColor'].includes(prop as string),
})<{ $color?: 'primary' | 'error'; $defaultColor?: string; $darkDefaultColor?: string }>(({ theme, $color, $defaultColor, $darkDefaultColor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  ...theme.customTypography.body1.regular,
  color: $color === 'error' ? theme.semantic.error.dark : ($defaultColor ?? theme.semantic.primary.dark),
  whiteSpace: 'nowrap',
  ...($color !== 'error' && $darkDefaultColor && {
    '[data-color-mode="dark"] &': { color: $darkDefaultColor },
  }),
  '&:hover': {
    textDecoration: 'underline',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '2px',
    borderRadius: theme.customBorderRadius.sm,
  },
}));
