'use client';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

/**
 * Styled root for SmoothBox.
 *
 * The squircle background is rendered by a `::before` pseudo-element whose
 * `clip-path` is driven by the CSS custom property `--squircle-clip`.
 * This keeps Emotion's static-style cache intact: Emotion serialises these
 * styles once, while the clip-path value is written directly to the element's
 * style attribute (a single DOM write per resize event — zero re-renders).
 *
 * `smoothRadius` is consumed here to set `borderRadius` (SSR fallback + shadow
 * shape) and is excluded from the DOM via `shouldForwardProp`.
 */
export const SmoothRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'smoothRadius' && prop !== 'smoothing',
})<{ smoothRadius?: string | number; smoothing?: number }>(({ smoothRadius }) => ({
  position: 'relative',
  // Standard border-radius: SSR fallback + shadow shape
  borderRadius: smoothRadius,
  // ::before carries the squircle background.
  // `clip-path: var(--squircle-clip)` is driven by the CSS custom property
  // written to the element's inline style on each ResizeObserver tick.
  // zIndex: -1 places it behind all children without forcing
  // position/zIndex on children (which would break absolutely
  // positioned overlays like glassmorphism layers).
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    backgroundColor: 'inherit',
    // clip-path is injected via CSS custom property written to the element's
    // inline style on each ResizeObserver tick — no re-render required.
    clipPath: 'var(--squircle-clip)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },
}));
