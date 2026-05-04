'use client';

/**
 * CounterBadge - Dynamic count/notification indicator.
 *
 * Two usage modes:
 *   1. Standalone: <CounterBadge count={5} />
 *   2. Overlay:    <CounterBadge count={5}><NotificationIcon /></CounterBadge>
 *      In overlay mode the badge sits at the top-right corner of the child element.
 *
 * Props:
 *   count         - number     - the value to display
 *   max           - number     - default: 99. Shows "${max}+" when count exceeds max
 *   variant       - 'circle' | 'square'   default: 'circle'
 *                   'circle' -> fully rounded pill (borderRadius.full)
 *                   'square' -> rounded rectangle (borderRadius.md)
 *   color         - CSS color string   default: semantic.error.main (red)
 *   showZero      - bool       - default: false. When false, renders nothing when count <= 0
 *   size          - 'sm' | 'md' | 'lg'   default: 'md'
 *   children      - ReactNode  - when provided, renders in overlay mode (badge at top-right)
 *   sx            - SxProps    - overrides on the badge element
 */

import React from 'react';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import {
  BadgeRoot,
  BadgeText,
  OverlayWrapper,
  OverlayAnchor,
} from './CounterBadge.styles';

export interface CounterBadgeProps {
  count?: number;
  max?: number;
  variant?: 'circle' | 'square';
  color?: string;
  showZero?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

// Component

export default function CounterBadge({
  count = 0,
  max = 99,
  variant = 'circle',
  color: colorProp,
  showZero = false,
  size = 'md',
  children,
  sx,
}: CounterBadgeProps) {
  const theme = useTheme();
  const color = colorProp ?? theme.semantic.error.main;

  // Hidden when count is zero and showZero is false
  const visible = showZero ? true : count > 0;
  if (!visible && !children) return null;

  const label = count > max ? `${max}+` : String(count);
  const isDefaultColor = !colorProp;

  const badge = visible ? (
    <BadgeRoot
      badgeColor={color}
      badgeVariant={variant}
      badgeSize={size}
      isDefaultColor={isDefaultColor}
      sx={sx}
    >
      <BadgeText
        className="counter-badge-text"
        component="span"
        badgeSize={size}
      >
        {label}
      </BadgeText>
    </BadgeRoot>
  ) : null;

  // Standalone mode, no children.
  if (!children) return badge;

  // Overlay mode, badge floats at top-right of child.
  return (
    <OverlayWrapper>
      {children}
      {visible && (
        <OverlayAnchor>
          {badge}
        </OverlayAnchor>
      )}
    </OverlayWrapper>
  );
}
