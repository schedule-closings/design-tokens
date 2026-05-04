'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ---------------------------------------------------------------------------
// MapRoot — the outer map wrapper with rounded corners and overflow hidden
// ---------------------------------------------------------------------------
export const MapRoot = styled(Box, {
  shouldForwardProp: (prop) =>
    !['borderRadius', 'height'].includes(prop as string),
})<{ borderRadius: string; height: number | string }>(
  ({ borderRadius, height }) => ({
    borderRadius,
    overflow: 'hidden',
    backgroundColor: 'var(--sc-map-bg)',
    position: 'relative',
    width: '100%',
    height,
  }),
);

// ---------------------------------------------------------------------------
// PlacePinButton — the Leaflet-style control button for pin placement
// ---------------------------------------------------------------------------
export const PlacePinButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  position: 'absolute',
  top: 120,
  left: 10,
  zIndex: 1100,
  width: 34,
  height: 34,
  backgroundColor: active ? theme.semantic.primary.main : 'white',
  borderRadius: '4px',
  border: '2px solid rgba(0,0,0,0.2)',
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: active ? theme.semantic.primary.dark : '#f4f4f4',
  },
}));
