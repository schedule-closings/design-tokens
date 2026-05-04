'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ---------------------------------------------------------------------------
// Size config
// fontSize below 14px; badge numerals are compact UI indicators, not prose text.
// ---------------------------------------------------------------------------
export const SIZES: Record<
  'sm' | 'md' | 'lg',
  { height: number; minWidth: number; fontSize: string; px: string }
> = {
  sm: { height: 16, minWidth: 16, fontSize: '10px', px: '4px' },
  md: { height: 20, minWidth: 20, fontSize: '11px', px: '6px' },
  lg: { height: 24, minWidth: 24, fontSize: '12px', px: '8px' },
};

// ---------------------------------------------------------------------------
// Styled: BadgeRoot - the colored pill/square that holds the number.
// ---------------------------------------------------------------------------
const BADGE_ROOT_PROPS = ['badgeColor', 'badgeVariant', 'badgeSize', 'isDefaultColor'] as const;

export const BadgeRoot = styled(Box, {
  shouldForwardProp: (prop) => !(BADGE_ROOT_PROPS as readonly string[]).includes(prop as string),
})<{
  badgeColor: string;
  badgeVariant: 'circle' | 'square';
  badgeSize: 'sm' | 'md' | 'lg';
  isDefaultColor: boolean;
}>(({ theme, badgeColor, badgeVariant, badgeSize, isDefaultColor }) => {
  const s = SIZES[badgeSize] ?? SIZES.md;
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: s.height,
    minWidth: s.minWidth,
    paddingLeft: s.px,
    paddingRight: s.px,
    backgroundColor: badgeColor,
    borderRadius: badgeVariant === 'circle' ? theme.customBorderRadius.full : theme.customBorderRadius.md,
    boxSizing: 'border-box',
    flexShrink: 0,
    ...(isDefaultColor && {
      '[data-color-mode="dark"] &': {
        backgroundColor: theme.colors.red[200],
        '& .counter-badge-text': { color: `${theme.colors.red[800]} !important` },
      },
    }),
  };
});

// ---------------------------------------------------------------------------
// Styled: BadgeText - the number inside the badge.
// ---------------------------------------------------------------------------
const BADGE_TEXT_PROPS = ['badgeSize'] as const;

export const BadgeText = styled(Typography, {
  shouldForwardProp: (prop) => !(BADGE_TEXT_PROPS as readonly string[]).includes(prop as string),
})<{
  badgeSize: 'sm' | 'md' | 'lg';
  component?: React.ElementType;
}>(({ theme, badgeSize }) => {
  const s = SIZES[badgeSize] ?? SIZES.md;
  return {
    fontSize: s.fontSize,
    fontWeight: theme.fontWeights.semibold,
    lineHeight: 1,
    color: theme.semantic.common.white,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };
});

// ---------------------------------------------------------------------------
// Styled: OverlayWrapper - relative container in overlay mode.
// ---------------------------------------------------------------------------
export const OverlayWrapper = styled(Box)({
  position: 'relative',
  display: 'inline-flex',
});

// ---------------------------------------------------------------------------
// Styled: OverlayAnchor - positions the badge at top-right of child.
// ---------------------------------------------------------------------------
export const OverlayAnchor = styled(Box)({
  position: 'absolute',
  top: 0,
  right: 0,
  transform: 'translate(50%, -50%)',
  zIndex: 1,
});
