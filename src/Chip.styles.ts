'use client';

import type React from 'react';
import { styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ---------------------------------------------------------------------------
// Color types (shared with Chip.tsx)
// ---------------------------------------------------------------------------
export type ChipColor = 'default' | 'new' | 'primary' | 'success' | 'error' | 'alert' | 'warning';
export type ChipStyleVariant = 'filled' | 'outline' | 'ghost' | 'duotone';

// ---------------------------------------------------------------------------
// Color config helpers; theme-based, used inside styled callbacks.
// ---------------------------------------------------------------------------

const _tint = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

interface DuotoneConfig {
  bg: string;
  text: string;
  darkBg: string;
  darkText: string;
}

function getDuotone(theme: Theme): Record<ChipColor, DuotoneConfig> {
  return {
    default: {
      bg: theme.colors.slate[100],
      text: theme.semantic.text.primary,
      darkBg: `color-mix(in srgb, ${theme.colors.slate[500]} 12%, transparent)`,
      darkText: theme.semantic.text.primary,
    },
    new: {
      bg: theme.colors.blue[100],
      text: theme.semantic.primary.dark,
      darkBg: `color-mix(in srgb, ${theme.semantic.primary.main} 12%, transparent)`,
      darkText: theme.semantic.primary.dark,
    },
    primary: {
      bg: theme.colors.blue[100],
      text: theme.semantic.primary.main,
      darkBg: `color-mix(in srgb, ${theme.semantic.primary.main} 12%, transparent)`,
      darkText: theme.semantic.primary.main,
    },
    success: {
      bg: theme.colors.green[100],
      text: theme.semantic.success.dark,
      darkBg: `color-mix(in srgb, ${theme.semantic.success.main} 12%, transparent)`,
      darkText: theme.semantic.success.dark,
    },
    error: {
      bg: theme.colors.red[100],
      text: theme.semantic.error.dark,
      darkBg: `color-mix(in srgb, ${theme.semantic.error.main} 12%, transparent)`,
      darkText: theme.semantic.error.dark,
    },
    alert: {
      bg: theme.colors.yellow[100],
      text: theme.semantic.alert.dark,
      darkBg: `color-mix(in srgb, ${theme.semantic.alert.main} 12%, transparent)`,
      darkText: theme.semantic.alert.dark,
    },
    warning: {
      bg: theme.colors.orange[100],
      text: theme.semantic.warning.dark,
      darkBg: `color-mix(in srgb, ${theme.semantic.warning.main} 12%, transparent)`,
      darkText: theme.semantic.warning.dark,
    },
  };
}

interface ColorConfig {
  filled: { bgcolor: string; text: string };
  outline: { borderColor: string; text: string };
  ghost: { text: string };
}

function getColorConfig(theme: Theme): Record<ChipColor, ColorConfig> {
  return {
    default: {
      filled: { bgcolor: theme.semantic.common.white, text: theme.semantic.text.primary },
      outline: { borderColor: theme.semantic.text.primary, text: theme.semantic.text.primary },
      ghost: { text: theme.semantic.text.primary },
    },
    new: {
      filled: { bgcolor: _tint(theme.semantic.primary.main, 0.12), text: theme.semantic.primary.dark },
      outline: { borderColor: theme.semantic.primary.main, text: theme.semantic.primary.dark },
      ghost: { text: theme.semantic.primary.main },
    },
    primary: {
      filled: { bgcolor: _tint(theme.semantic.primary.main, 0.12), text: theme.semantic.primary.main },
      outline: { borderColor: theme.semantic.primary.main, text: theme.semantic.primary.main },
      ghost: { text: theme.semantic.primary.main },
    },
    success: {
      filled: { bgcolor: _tint(theme.semantic.success.main, 0.12), text: theme.semantic.success.dark },
      outline: { borderColor: theme.semantic.success.main, text: theme.semantic.success.dark },
      ghost: { text: theme.semantic.success.main },
    },
    error: {
      filled: { bgcolor: _tint(theme.semantic.error.main, 0.12), text: theme.semantic.error.dark },
      outline: { borderColor: theme.semantic.error.main, text: theme.semantic.error.dark },
      ghost: { text: theme.semantic.error.main },
    },
    alert: {
      filled: { bgcolor: _tint(theme.semantic.alert.main, 0.12), text: theme.semantic.alert.dark },
      outline: { borderColor: theme.semantic.alert.main, text: theme.semantic.alert.dark },
      ghost: { text: theme.semantic.alert.main },
    },
    warning: {
      filled: { bgcolor: _tint(theme.semantic.warning.main, 0.12), text: theme.semantic.warning.dark },
      outline: { borderColor: theme.semantic.warning.main, text: theme.semantic.warning.dark },
      ghost: { text: theme.semantic.warning.main },
    },
  };
}

/** Resolve background + border for a chip style/color combo */
function resolveChipVisuals(chipStyle: ChipStyleVariant, chipColor: ChipColor, isTagMode: boolean, theme: Theme) {
  if (isTagMode) {
    return {
      backgroundColor: theme.colors.gray[200],
      border: 'none',
      '[data-color-mode="dark"] &': {
        backgroundColor: `color-mix(in srgb, ${theme.colors.slate[500]} 24%, transparent)`,
      },
    };
  }
  const DUOTONE = getDuotone(theme);
  if (chipStyle === 'duotone') {
    const dt = DUOTONE[chipColor] ?? DUOTONE.default;
    return {
      backgroundColor: dt.bg,
      border: '1px solid transparent',
      '[data-color-mode="dark"] &': {
        backgroundColor: dt.darkBg,
      },
    };
  }
  const COLOR_CONFIG = getColorConfig(theme);
  const cfg = COLOR_CONFIG[chipColor] ?? COLOR_CONFIG.default;
  switch (chipStyle) {
    case 'filled':
      return { backgroundColor: cfg.filled.bgcolor, border: 'none' };
    case 'outline':
      return { backgroundColor: 'transparent', border: `1px solid ${cfg.outline.borderColor}` };
    case 'ghost':
      return { backgroundColor: 'transparent', border: 'none' };
  }
}

/** Resolve text color for a chip style/color combo */
export function resolveChipTextColor(chipStyle: ChipStyleVariant, chipColor: ChipColor, isTagMode: boolean, theme: Theme): string {
  if (isTagMode) return theme.semantic.text.primary;
  const DUOTONE = getDuotone(theme);
  if (chipStyle === 'duotone') {
    return (DUOTONE[chipColor] ?? DUOTONE.default).text;
  }
  const COLOR_CONFIG = getColorConfig(theme);
  const cfg = COLOR_CONFIG[chipColor] ?? COLOR_CONFIG.default;
  switch (chipStyle) {
    case 'filled': return cfg.filled.text;
    case 'outline': return cfg.outline.text ?? cfg.filled.text;
    case 'ghost': return cfg.ghost.text;
  }
}

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const CHIP_ROOT_PROPS = ['compact', 'isTagMode', 'isButton', 'noTruncate', 'chipStyle', 'chipColor', 'isDisabled'] as const;

export const ChipRoot = styled(Box, {
  shouldForwardProp: (prop) => !(CHIP_ROOT_PROPS as readonly string[]).includes(prop as string),
})<{
  compact?: boolean;
  isTagMode?: boolean;
  isButton?: boolean;
  noTruncate?: boolean;
  chipStyle?: ChipStyleVariant;
  chipColor?: ChipColor;
  isDisabled?: boolean;
} & { component?: React.ElementType; disabled?: boolean }>(({ theme, compact, isTagMode, isButton, noTruncate, chipStyle = 'filled', chipColor = 'default', isDisabled }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  maxWidth: noTruncate ? 'none' : '100%',
  minWidth: 0,
  flexShrink: noTruncate ? 0 : undefined,
  gap: compact ? theme.customSpacing[0.5] : theme.customSpacing[1],
  paddingTop: compact ? (isTagMode ? theme.customSpacing[1] : theme.customSpacing[0.5]) : (isTagMode ? theme.customSpacing[0.5] : theme.customSpacing[1]),
  paddingBottom: compact ? (isTagMode ? theme.customSpacing[1] : theme.customSpacing[0.5]) : (isTagMode ? theme.customSpacing[0.5] : theme.customSpacing[1]),
  paddingLeft: compact ? (isTagMode ? theme.customSpacing[2] : theme.customSpacing[2.5]) : theme.customSpacing[3],
  paddingRight: compact ? (isTagMode ? theme.customSpacing[1] : theme.customSpacing[2.5]) : (isTagMode ? theme.customSpacing[2] : theme.customSpacing[3]),
  borderRadius: theme.customBorderRadius.full,
  transition: 'filter 0.15s ease',
  opacity: isDisabled ? 0.6 : 1,
  pointerEvents: isDisabled ? 'none' : undefined,
  cursor: isButton ? 'pointer' : 'default',
  '&:hover': { filter: 'brightness(0.95)' },
  ...(isButton && {
    appearance: 'none' as const,
    fontFamily: 'inherit',
    textAlign: 'left' as const,
  }),
  ...resolveChipVisuals(chipStyle, chipColor, Boolean(isTagMode), theme),
}));

export const ChipLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'noTruncate',
})<{ noTruncate?: boolean; component?: React.ElementType }>(({ noTruncate }) => ({
  whiteSpace: 'nowrap',
  overflow: noTruncate ? 'visible' : 'hidden',
  textOverflow: noTruncate ? 'clip' : 'ellipsis',
  lineHeight: 1,
  minWidth: 0,
}));

export const ChipIconBox = styled(Box)<{ compact?: boolean }>(({ compact }) => ({
  display: 'inline-flex',
  width: compact ? 16 : 20,
  height: compact ? 16 : 20,
  flexShrink: 0,
}));

export const ChipRemoveButton = styled(Box)<{ compact?: boolean } & { component?: React.ElementType }>(({ compact }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  margin: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  width: compact ? 16 : 20,
  height: compact ? 16 : 20,
  flexShrink: 0,
}));
