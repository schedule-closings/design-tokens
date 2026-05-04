'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PIN_ROOT_PROPS = ['ownerMuted', 'ownerDimmed'] as const;

export const PinRoot = styled(Box, {
  shouldForwardProp: (prop) => !(PIN_ROOT_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerMuted: boolean;
  ownerDimmed: boolean;
}>(({ ownerMuted, ownerDimmed }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  filter: ownerMuted
    ? 'grayscale(100%) drop-shadow(0px 1px 3px rgba(0,0,0,0.1))'
    : 'drop-shadow(0px 1px 3px rgba(0,0,0,0.1)) drop-shadow(0px 1px 2px rgba(0,0,0,0.06))',
  opacity: ownerMuted ? 0.7 : ownerDimmed ? 0.85 : 1,
  transformOrigin: 'center bottom',
  transition: 'transform 0.15s ease, filter 0.2s ease, opacity 0.2s ease',
  '&:hover': {
    transform: 'scale(1.12)',
  },
}));

const PIN_FRAME_PROPS = ['frameColor', 'strokeColor', 'ownerPadding'] as const;

export const PinFrame = styled(Box, {
  shouldForwardProp: (prop) => !(PIN_FRAME_PROPS as readonly string[]).includes(prop as string),
})<{
  frameColor: string;
  strokeColor: string;
  ownerPadding: number;
}>(({ theme, frameColor, strokeColor, ownerPadding }) => ({
  backgroundColor: frameColor,
  borderRadius: theme.customBorderRadius.md,
  border: `1.5px solid ${strokeColor}`,
  padding: ownerPadding,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const GROUND_SHADOW_PROPS = ['ownerActive'] as const;

export const GroundShadow = styled(Box, {
  shouldForwardProp: (prop) => !(GROUND_SHADOW_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerActive: boolean;
}>(({ theme, ownerActive }) => ({
  width: ownerActive ? 32 : 26,
  height: ownerActive ? 8 : 6,
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: 'rgba(0,0,0,0.28)',
  filter: 'blur(4px)',
  marginTop: 1,
}));

export const PeekCardRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[3],
  alignItems: 'flex-start',
  padding: theme.customSpacing[4],
  minWidth: 260,
  maxWidth: 320,
}));

export const PeekCardMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[1],
  minWidth: 0,
  flex: 1,
}));

export const PeekCardName = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const META_ROW_PROPS = ['ownerGap'] as const;

export const MetaRow = styled(Box, {
  shouldForwardProp: (prop) => !(META_ROW_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerGap?: number | string;
}>(({ theme, ownerGap }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: ownerGap ?? theme.customSpacing[1],
}));

export const AddressRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[1],
}));

export const AddressIconWrap = styled(Box)({
  flexShrink: 0,
  marginTop: 2,
});

const META_TEXT_PROPS = ['ownerColor'] as const;

export const MetaText = styled(Typography, {
  shouldForwardProp: (prop) => !(META_TEXT_PROPS as readonly string[]).includes(prop as string),
})<{
  ownerColor: string;
}>(({ theme, ownerColor }) => ({
  ...theme.customTypography.body2.regular,
  color: ownerColor,
}));
