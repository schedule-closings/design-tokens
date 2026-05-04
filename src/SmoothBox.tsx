'use client';

/**
 * SmoothBox — drop-in Box replacement with iOS-style squircle corners.
 *
 * Uses a `::before` pseudo-element with `clip-path` to render the squircle
 * background shape. The element itself has NO clip-path and NO overflow:hidden,
 * so children, shadows, dropdowns, and focus rings are never clipped.
 *
 * Usage:
 *   <SmoothBox smoothRadius={borderRadius.xl} sx={{ bgcolor: 'white', p: 2 }}>
 *     …content…
 *   </SmoothBox>
 *
 * Props:
 *   smoothRadius  {string|number}  Border radius token value ('12px') or number (12).
 *                                  Omitting this prop renders a plain Box.
 *   smoothing     {number}         0 = standard circle, 0.6 = iOS (default), 1 = maximum.
 *   All other props are forwarded to MUI Box.
 *
 * How it works:
 *   • On mount + resize, measures element dimensions via ResizeObserver.
 *   • Computes an SVG path using the squircle formula and applies it as
 *     `clip-path: path(...)` on the `::before` pseudo-element only.
 *   • The pseudo inherits `backgroundColor` from the element and renders the
 *     squircle shape as a background layer behind all children.
 *   • Children get `position: relative; z-index: 1` via `& > *` to sit above
 *     the pseudo background.
 *   • Falls back to standard `borderRadius` on SSR / before measurement.
 *   • box-shadow on the element follows standard border-radius (visually close
 *     at typical 8–24px radii).
 */

import { useRef, useState, useEffect } from 'react';
import { BoxProps } from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { getSquirclePath, parseRadius, CORNER_SMOOTHING } from './squircle';
import { SmoothRoot } from './SmoothBox.styles';

export interface SmoothBoxProps extends Omit<BoxProps, 'sx'> {
  smoothRadius?: string | number;
  smoothing?: number;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export default function SmoothBox({
  smoothRadius,
  smoothing = CORNER_SMOOTHING,
  children,
  sx,
  ...props
}: SmoothBoxProps) {
  const ref = useRef<HTMLElement>(null);
  const [clipPath, setClipPath] = useState('');

  const r = typeof smoothRadius === 'string' ? parseRadius(smoothRadius) : (smoothRadius ?? 0);

  useEffect(() => {
    if (!ref.current || !r) return;

    function measure() {
      const el = ref.current;
      if (!el) return;
      const w = (el as HTMLElement).offsetWidth;
      const h = (el as HTMLElement).offsetHeight;
      if (w > 0 && h > 0) {
        const path = getSquirclePath(w, h, r, smoothing);
        setClipPath(`path('${path}')`);
      }
    }

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [r, smoothing]);

  return (
    <SmoothRoot
      ref={ref}
      smoothRadius={smoothRadius}
      smoothing={smoothing}
      style={clipPath ? ({ '--squircle-clip': clipPath } as React.CSSProperties) : undefined}
      sx={sx}
      {...props}
    >
      {children}
    </SmoothRoot>
  );
}
