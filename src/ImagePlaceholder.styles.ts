'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ---------------------------------------------------------------------------
// Root wrapper - inline-block container with relative positioning.
// ---------------------------------------------------------------------------

const ROOT_PROPS = ['ownerWidth', 'ownerHeight'] as const;

export const PlaceholderRoot = styled(Box, {
  shouldForwardProp: (prop) => !(ROOT_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerWidth: number;
  ownerHeight: number;
}>(({ ownerWidth, ownerHeight }) => ({
  position: 'relative',
  width: ownerWidth,
  height: ownerHeight,
  flexShrink: 0,
  display: 'inline-block',
}));

// ---------------------------------------------------------------------------
// Shape container - the inner clip area (used for both Box and SmoothBox).
// ---------------------------------------------------------------------------

const SHAPE_PROPS = ['isInitials', 'hasSrc', 'initialsBg', 'borderWidth'] as const;

export const ShapeContainer = styled(Box, {
  shouldForwardProp: (prop) => !(SHAPE_PROPS as readonly string[]).includes(prop as string),
})<{
  isInitials: boolean;
  hasSrc: boolean;
  initialsBg: string;
  borderWidth: number;
}>(({ theme, isInitials, hasSrc, initialsBg, borderWidth }) => ({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  ...(isInitials
    ? {
        backgroundColor: initialsBg,
        border: `${borderWidth}px solid rgba(0,0,0,0.1)`,
      }
    : {
        backgroundColor: hasSrc ? 'transparent' : theme.colors.slate[100],
        border: `${borderWidth}px solid ${theme.colors.slate[300]}`,
      }),
}));

// ---------------------------------------------------------------------------
// Badge overlay - absolute-positioned bottom-right.
// ---------------------------------------------------------------------------

const BADGE_PROPS = ['badgeSize', 'badgeOverflow'] as const;

export const BadgeWrapper = styled(Box, {
  shouldForwardProp: (prop) => !(BADGE_PROPS as readonly string[]).includes(prop as string),
})<{
  badgeSize: number;
  badgeOverflow: number;
}>(({ badgeSize, badgeOverflow }) => ({
  position: 'absolute',
  bottom: -badgeOverflow,
  right: -badgeOverflow,
  width: badgeSize,
  height: badgeSize,
  display: 'flex',
  pointerEvents: 'none',
}));

// ---------------------------------------------------------------------------
// ShapeContent internals
// ---------------------------------------------------------------------------

/** Centered wrapper used for both initials and empty-icon states */
export const CenteredOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/** Initials text span */
const INITIALS_PROPS = ['iconSize', 'initialsTextColor'] as const;

export const InitialsText = styled('span', {
  shouldForwardProp: (prop) => !(INITIALS_PROPS as readonly string[]).includes(prop as string),
})<{
  iconSize: number;
  initialsTextColor: string;
}>(({ theme, iconSize, initialsTextColor }) => ({
  fontSize: iconSize,
  fontWeight: 500,
  fontFamily: theme.fontFamilies.body,
  color: initialsTextColor || theme.semantic.text.secondary,
  letterSpacing: '1px',
  lineHeight: 1,
  userSelect: 'none',
}));

/** Image element */
export const ImageElement = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});
