'use client';

/**
 * Spinner - SV Design System loading indicator.
 *
 * Thin wrapper around MUI's CircularProgress that defaults to `currentColor`
 * so it inherits from the surrounding text color and matches icon sizing.
 */

import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export interface SpinnerProps {
  /** Diameter of the outer box in pixels. Default 20. */
  size?: number;
  /** Stroke color. Defaults to `currentColor`. */
  color?: string;
  /** Stroke thickness. Default 5. */
  thickness?: number;
  /** Optional aria-label. Defaults to `Loading`. */
  ariaLabel?: string;
}

export default function Spinner({
  size = 20,
  color = 'currentColor',
  thickness = 5,
  ariaLabel = 'Loading',
}: SpinnerProps) {
  const padding = size / 8;
  const innerSize = size - padding * 2;

  return (
    <Box
      role="status"
      aria-label={ariaLabel}
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <CircularProgress
        size={innerSize}
        thickness={thickness}
        sx={{ color }}
      />
    </Box>
  );
}
