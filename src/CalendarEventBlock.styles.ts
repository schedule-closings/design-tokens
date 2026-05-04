'use client';

import React from 'react';
import { styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// ---------------------------------------------------------------------------
// Transaction color types (shared with CalendarEventBlock.tsx)
// ---------------------------------------------------------------------------

export type TransactionType =
  | 'purchase-lending'
  | 'purchase-cash'
  | 'refinance'
  | 'lease-option'
  | 'title'
  | 'deeds'
  | 'wills-estates'
  | 'custom-request';

export type EventType = 'internal' | 'external';

export interface TransactionColorSet {
  bg: string;
  border: string;
  text: string;
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

export function getTransactionColors(theme: Theme): Record<TransactionType, TransactionColorSet> {
  return {
    'purchase-lending': { bg: theme.colors.green[100], border: theme.colors.green[300], text: theme.colors.green[600] },
    'purchase-cash':    { bg: theme.colors.blue[100],  border: theme.colors.blue[300],  text: theme.colors.blue[600] },
    'refinance':        { bg: theme.colors.red[100],   border: theme.colors.red[300],   text: theme.colors.red[600] },
    'lease-option':     { bg: theme.colors.purple[100], border: theme.colors.purple[300], text: theme.colors.purple[600] },
    'title':            { bg: theme.colors.yellow[100], border: theme.colors.yellow[300], text: theme.colors.yellow[700] },
    'deeds':            { bg: theme.colors.slate[200],  border: theme.colors.slate[400],  text: theme.colors.slate[700] },
    'wills-estates':    { bg: theme.colors.indigo[100], border: theme.colors.indigo[300], text: theme.colors.indigo[600] },
    'custom-request':   { bg: theme.colors.orange[100], border: theme.colors.orange[300], text: theme.colors.orange[600] },
  };
}

export function getColors(
  eventType: EventType,
  transactionType: TransactionType,
  theme: Theme,
): TransactionColorSet {
  if (eventType === 'external') return {
    bg: theme.colors.slate[100],
    border: theme.colors.slate[300],
    text: theme.colors.slate[600],
  };
  return getTransactionColors(theme)[transactionType];
}

// ---------------------------------------------------------------------------
// Wrapper root --- positions pill + peek
// ---------------------------------------------------------------------------

const WRAPPER_ROOT_PROPS = ['ownerHovered'] as const;

export const WrapperRoot = styled(Box, {
  shouldForwardProp: (prop) => !(WRAPPER_ROOT_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerHovered: boolean;
}>(({ ownerHovered }) => ({
  position: 'relative',
  display: 'inline-flex',
  width: '100%',
  zIndex: ownerHovered ? 20 : 'auto',
}));

// ---------------------------------------------------------------------------
// Compact pill
// ---------------------------------------------------------------------------

const PILL_ROOT_PROPS = ['ownerBg', 'ownerBorder', 'ownerText', 'ownerNoDarkRecolor'] as const;

export const PillRoot = styled(Box, {
  shouldForwardProp: (prop) => !(PILL_ROOT_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerBg: string;
  ownerBorder: string;
  ownerText: string;
  /** When true, skip the dark-mode `color-mix` recolor and use the bg/border/text props verbatim. Used for the deeds transaction in dark mode where the design calls for an explicit gray palette that color-mix can't reproduce. */
  ownerNoDarkRecolor?: boolean;
}>(({ theme, ownerBg, ownerBorder, ownerText, ownerNoDarkRecolor }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: 28,
  paddingLeft: theme.customSpacing[2],
  paddingRight: theme.customSpacing[2],
  paddingTop: theme.customSpacing[1],
  paddingBottom: theme.customSpacing[1],
  borderRadius: theme.customBorderRadius.md,
  backgroundColor: ownerBg,
  border: `1px solid ${ownerBorder}`,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  overflow: 'hidden',
  '&:hover': {
    filter: 'brightness(0.97)',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: 1,
  },
  // Dark mode override --- translucent tinted bg + tinted border keyed off
  // the pill's text color. Bg lifted from 15% --- 20% so blue / red /
  // purple / indigo pills clear WCAG AA (4.5:1) against the slate/900
  // mica cell when paired with the lightened PillText below; the
  // already-comfortable green / yellow / orange types just gain a hair
  // more presence. Border stays at 30%. Skipped entirely when
  // `ownerNoDarkRecolor` is true (deeds case uses solid gray spec).
  ...(ownerNoDarkRecolor
    ? null
    : {
        '[data-color-mode="dark"] &': {
          backgroundColor: `color-mix(in srgb, ${ownerText} 20%, transparent)`,
          borderColor: `color-mix(in srgb, ${ownerText} 30%, transparent)`,
        },
      }),
}));

const PILL_TEXT_PROPS = ['ownerTextColor', 'ownerNoDarkRecolor'] as const;

export const PillText = styled(Typography, {
  shouldForwardProp: (prop) => !(PILL_TEXT_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerTextColor: string;
  /** When true, skip the dark-mode color-mix lightening --- caller is supplying an already-correct color (e.g. white for the deeds dark case). */
  ownerNoDarkRecolor?: boolean;
}>(({ theme, ownerTextColor, ownerNoDarkRecolor }) => ({
  ...theme.customTypography.body2.semibold,
  color: ownerTextColor,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: 1,
  // Lighten the text in dark mode by mixing more white with the brand
  // hue (was 30% white --- bumped to 60% so the saturated pills clear
  // WCAG AA 4.5:1 against the lifted bg above). Skipped for the deeds
  // case where the caller provides a final solid color.
  ...(ownerNoDarkRecolor
    ? null
    : {
        '[data-color-mode="dark"] &': {
          color: `color-mix(in srgb, ${ownerTextColor} 100%, ${theme.colors.white} 60%)`,
        },
      }),
}));

// ---------------------------------------------------------------------------
// Peek popover container
// ---------------------------------------------------------------------------

const PEEK_CONTAINER_PROPS = ['ownerTop', 'ownerLeft', 'ownerCaretAlign', 'ownerVertical'] as const;

export const PeekContainer = styled(Box, {
  shouldForwardProp: (prop) => !(PEEK_CONTAINER_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerTop: number;
  ownerLeft: number;
  ownerCaretAlign: 'left' | 'center' | 'right';
  ownerVertical: 'top' | 'bottom';
}>(({ ownerTop, ownerLeft, ownerCaretAlign, ownerVertical }) => ({
  position: 'fixed',
  top: ownerTop,
  left: ownerLeft,
  zIndex: 9999,
  display: 'flex',
  flexDirection: ownerVertical === 'top' ? 'column' : 'column-reverse',
  alignItems: ownerCaretAlign === 'left' ? 'flex-start' : ownerCaretAlign === 'right' ? 'flex-end' : 'center',
}));

// ---------------------------------------------------------------------------
// Peek card body (inside SmoothBox --- applied via sx on SmoothBox)
// NOTE: SmoothBox is a third-party component that needs sx. We create a
// helper style object instead.
// ---------------------------------------------------------------------------

export function getPeekCardStyles(theme: Theme) {
  return {
    width: 493,
    padding: theme.customSpacing[5],
    // Mica-layer surface: common.white as the base flips to slate/900 in
    // dark mode; surfaceOverlay.high stacks a 12% white tint so the card
    // reads as a translucent panel above the calendar grid in dark mode
    // (and stays a clean white above the grid in light mode where the
    // overlay collapses to a no-op).
    backgroundColor: theme.semantic.common.white,
    backgroundImage: theme.surfaceOverlay.high,
    border: `1px solid ${theme.semantic.divider}`,
    // Light-mode shadow stays soft --- the white card already has plenty
    // of contrast against the calendar grid. Dark mode swaps in the
    // punchier shadow so the card lifts off the deep-slate cells where
    // the soft values washed out.
    boxShadow:
      '0 8px 16px rgba(0,0,0,0.08), 0 20px 40px rgba(0,0,0,0.12), 0 48px 64px rgba(0,0,0,0.06)',
    '[data-color-mode="dark"] &': {
      boxShadow:
        '0 8px 16px rgba(0,0,0,0.20), 0 20px 40px rgba(0,0,0,0.28), 0 48px 64px rgba(0,0,0,0.16)',
    },
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.customSpacing[3],
  };
}

// ---------------------------------------------------------------------------
// InfoRow (icon + text row in peek)
// ---------------------------------------------------------------------------

export const InfoRowRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[3],
}));

export const InfoRowIconWrap = styled(Box)({
  flexShrink: 0,
  opacity: 0.5,
  display: 'flex',
  alignItems: 'center',
});

export const InfoRowText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.text.primary,
}));

// ---------------------------------------------------------------------------
// Assigned row
// ---------------------------------------------------------------------------

export const AssignedRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[3],
}));

export const AssignedName = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  // Flips with color mode --- was hardcoded to blue/950, which stayed dark
  // navy on dark surfaces and rendered nearly invisible.
  color: theme.semantic.text.primary,
}));

export const AssignedRole = styled(Typography)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: theme.semantic.text.primary,
  marginLeft: theme.customSpacing[1],
}));

// ---------------------------------------------------------------------------
// Peek divider
// ---------------------------------------------------------------------------

export const PeekDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.semantic.divider,
}));

// ---------------------------------------------------------------------------
// Action buttons row
// ---------------------------------------------------------------------------

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[4],
}));

// ---------------------------------------------------------------------------
// Caret / arrow
// ---------------------------------------------------------------------------

const CARET_PROPS = ['ownerVertical', 'ownerCaretAlign'] as const;

// PeekCaret is now a positioning wrapper for an inline SVG caret ---
// renders proper fill + stroke so the V's two outer edges share the
// card's border, while the V's open top is hidden behind the card.
// Overlaps the card by 1px so the card's straight border line at the
// V mouth is covered by the SVG's fill, producing a single seamless
// shape (the original CSS-triangle approach couldn't carry a stroke).
//
// SVG inside is authored pointing DOWN (V tip at the bottom of the
// 16--8 viewBox); we flip it 180- degrees for `ownerVertical === 'bottom'`
// where the card sits below the owner and the caret needs to point UP.
export const PeekCaret = styled(Box, {
  shouldForwardProp: (prop) => !(CARET_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerVertical: 'top' | 'bottom';
  ownerCaretAlign: 'left' | 'center' | 'right';
}>(({ theme, ownerVertical, ownerCaretAlign }) => ({
  width: 16,
  height: 8,
  flexShrink: 0,
  // 1px overlap with the card so the SVG's fill (top edge of the
  // triangle path) covers the card's border line at the V's mouth.
  ...(ownerVertical === 'top'
    ? { marginTop: -1 }
    : { marginBottom: -1, transform: 'rotate(180deg)' }),
  marginLeft: ownerCaretAlign === 'left' ? theme.customSpacing[5] : 'auto',
  marginRight: ownerCaretAlign === 'right' ? theme.customSpacing[5] : 'auto',
  // Soft drop-shadow continues the card's box-shadow over the caret in
  // light mode; dark mode bumps the alpha to match the card's punchier
  // shadow stack so the caret stays attached visually.
  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.06))',
  '[data-color-mode="dark"] &': {
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.24))',
  },
}));

// ---------------------------------------------------------------------------
// Action button style helper (applied via sx on BaseButton)
// ---------------------------------------------------------------------------

export function getActionButtonStyles(theme: Theme) {
  return {
    flex: 1,
    // Both bg and text use semantic primary tokens so the button flips:
    //   light --- blue/100 swatch + blue/800 text
    //   dark  --- blue/900 swatch + blue/300 text
    // (was hardcoded blue/50 + primary.dark, which kept the bg bright and
    // pushed the text into the same blue range as the swatch in dark mode.)
    backgroundColor: theme.semantic.primary.swatch,
    borderRadius: theme.customBorderRadius.xl,
    color: theme.semantic.primary.dark,
    padding: theme.customSpacing[3],
    ...theme.customTypography.body2.semibold,
    '&:hover': {
      backgroundColor: theme.colors.blue[200],
    },
    '[data-color-mode="dark"] &:hover': {
      backgroundColor: theme.colors.blue[800],
    },
  };
}
