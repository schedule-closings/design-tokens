'use client';

/**
 * TruncatedText - single-line text with automatic overflow tooltip.
 *
 * Renders text with CSS ellipsis truncation.
 * Uses ResizeObserver to detect when text is actually overflowing its container.
 * A Tooltip showing the full text is rendered ONLY when overflow is detected;
 * if the container is wide enough to show all text, no tooltip appears.
 *
 * Props:
 *   children   - string    - text to display (also used as tooltip title)
 *   placement  - string    - tooltip placement, default "top"
 *   component  - string    - HTML element to render, default "span"
 *   sx         - SxProps   - applied to the Typography element;
 *                            avoid overriding `display` because it breaks truncation detection
 *   ...props   - any MUI TypographyProps passthrough
 *
 * @note Tooltip availability has a one-frame delay on first render (useEffect runs after mount).
 *       This is imperceptible in normal use.
 */

import React, { useRef, useState, useEffect } from 'react';
import { TypographyProps } from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import Tooltip from './Tooltip';
import { TooltipProps } from './Tooltip';
import { TruncatedTypography } from './TruncatedText.styles';

export interface TruncatedTextProps extends Omit<TypographyProps, 'sx' | 'component' | 'children'> {
  children: string;
  placement?: TooltipProps['placement'];
  component?: React.ElementType;
  sx?: SxProps<Theme>;
}

export default function TruncatedText({
  children,
  placement = 'top',
  component = 'span',
  sx,
  ...props
}: TruncatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => setIsOverflowing(el.scrollWidth > el.offsetWidth);
    check(); // run on mount

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]); // re-check when text content changes

  const text = (
    <TruncatedTypography
      ref={ref}
      component={component}
      sx={sx}
      {...props}
    >
      {children}
    </TruncatedTypography>
  );

  if (!isOverflowing) return text;

  return (
    <Tooltip title={children} placement={placement}>
      {text}
    </Tooltip>
  );
}
