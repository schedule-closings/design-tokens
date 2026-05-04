'use client';

/**
 * ArrowStep --- arrow-shaped progress step.
 *
 * Props:
 *   shape       --- 'none' | 'initial' | 'middle' | 'end'
 *   state       --- 'active' | 'inactive' | 'completed'
 *   status      --- active-state status variant
 *   label       --- primary step label
 *   description --- optional secondary text
 *   width       --- pixel width
 *   height      --- pixel height
 *   sx          --- overrides on the outer wrapper
 */

import React, { useEffect, useRef, useState } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import SmoothBox from './SmoothBox';
import { ArrowContentBox, ArrowDescText, ArrowLabelText } from './ArrowStep.styles';

export type ArrowShape = 'none' | 'initial' | 'middle' | 'end';
export type ArrowState = 'active' | 'inactive' | 'completed';
export type ArrowStatus =
  | 'default'
  | 'in-progress'
  | 'semi-completed'
  | 'final-completed'
  | 'canceled';

export interface ArrowStepProps extends Omit<BoxProps, 'sx'> {
  shape?: ArrowShape;
  state?: ArrowState;
  status?: ArrowStatus;
  label?: React.ReactNode;
  description?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
}

const D = 13;
const PAD_BASE = 20;
const PAD_ARROW = PAD_BASE + D;
const CORNER_R = 4;

interface ColorConfig {
  fill: string;
  stroke: string;
  text: string;
  opacity?: number;
}

function getCfg(state: ArrowState, status: ArrowStatus, theme: Theme): ColorConfig {
  const inactive: ColorConfig = {
    fill: 'var(--sc-arrow-inactive-fill)',
    stroke: 'var(--sc-arrow-inactive-stroke)',
    text: theme.semantic.text.primary,
  };

  if (state === 'completed') return { ...inactive, opacity: 0.5 };
  if (state !== 'active') return inactive;

  switch (status) {
    case 'in-progress':
      return { fill: theme.colors.yellow[50], stroke: theme.semantic.alert.main, text: theme.semantic.alert.dark };
    case 'semi-completed':
      return { fill: theme.colors.green[50], stroke: theme.semantic.success.main, text: theme.semantic.success.dark };
    case 'final-completed':
      return { fill: theme.semantic.success.main, stroke: theme.semantic.success.main, text: theme.semantic.common.white };
    case 'canceled':
      return { fill: theme.semantic.error.main, stroke: theme.semantic.error.main, text: theme.semantic.common.white };
    default:
      return {
        fill: 'var(--sc-arrow-active-fill)',
        stroke: 'var(--sc-arrow-active-stroke)',
        text: 'var(--sc-arrow-active-text)',
      };
  }
}

interface Vec2 {
  x: number;
  y: number;
}

function v(x: number, y: number): Vec2 {
  return { x, y };
}

function vsub(a: Vec2, b: Vec2): Vec2 {
  return v(a.x - b.x, a.y - b.y);
}

function vadd(a: Vec2, b: Vec2): Vec2 {
  return v(a.x + b.x, a.y + b.y);
}

function vscale(a: Vec2, s: number): Vec2 {
  return v(a.x * s, a.y * s);
}

function vlen(a: Vec2): number {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function vnorm(a: Vec2): Vec2 {
  const l = vlen(a);
  return l > 0 ? vscale(a, 1 / l) : a;
}

function vdist(a: Vec2, b: Vec2): number {
  return vlen(vsub(a, b));
}

function roundedPolygonPath(pts: Vec2[], r: number): string {
  const n = pts.length;
  const cmds: string[] = [];

  for (let i = 0; i < n; i += 1) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];
    const d1 = vnorm(vsub(prev, curr));
    const d2 = vnorm(vsub(next, curr));
    const actualR = Math.min(r, vdist(prev, curr) / 2, vdist(next, curr) / 2);
    const t1 = vadd(curr, vscale(d1, actualR));
    const t2 = vadd(curr, vscale(d2, actualR));

    cmds.push(i === 0 ? `M ${t1.x},${t1.y}` : `L ${t1.x},${t1.y}`);
    cmds.push(`Q ${curr.x},${curr.y} ${t2.x},${t2.y}`);
  }

  cmds.push('Z');
  return cmds.join(' ');
}

function buildPath(shape: ArrowShape, width: number, height: number): string | null {
  const inset = 0.5;
  let pts: Vec2[];

  if (shape === 'initial') {
    pts = [
      v(inset, inset),
      v(width - D - inset, inset),
      v(width - inset, height / 2),
      v(width - D - inset, height - inset),
      v(inset, height - inset),
    ];
  } else if (shape === 'middle') {
    pts = [
      v(inset, inset),
      v(width - D - inset, inset),
      v(width - inset, height / 2),
      v(width - D - inset, height - inset),
      v(inset, height - inset),
      v(D + inset, height / 2),
    ];
  } else if (shape === 'end') {
    pts = [
      v(inset, inset),
      v(width - inset, inset),
      v(width - inset, height - inset),
      v(inset, height - inset),
      v(D + inset, height / 2),
    ];
  } else {
    return null;
  }

  return roundedPolygonPath(pts, CORNER_R);
}

function getContentPx(shape: ArrowShape): Record<string, string> {
  switch (shape) {
    case 'initial':
      return { pl: `${PAD_BASE}px`, pr: `${PAD_ARROW}px` };
    case 'middle':
      return { pl: `${PAD_ARROW}px`, pr: `${PAD_ARROW}px` };
    case 'end':
      return { pl: `${PAD_ARROW}px`, pr: `${PAD_BASE}px` };
    default:
      return { px: `${PAD_BASE}px` };
  }
}

export default function ArrowStep({
  shape = 'initial',
  state = 'inactive',
  status = 'default',
  label,
  description,
  width = 256,
  height = 52,
  sx,
  ...props
}: ArrowStepProps) {
  const theme = useTheme();
  const cfg = getCfg(state, status, theme);
  const contentPx = getContentPx(shape);
  const containerRef = useRef<HTMLDivElement>(null);
  const [actualW, setActualW] = useState(width);

  useEffect(() => {
    if (shape === 'none') return undefined;

    const el = containerRef.current;
    if (!el) return undefined;

    const { width: measuredWidth } = el.getBoundingClientRect();
    if (measuredWidth > 0) setActualW(measuredWidth);

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width;
      if (nextWidth > 0) setActualW(nextWidth);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [shape]);

  const pathD = buildPath(shape, actualW, height);
  const content = (
    <ArrowContentBox style={contentPx as React.CSSProperties}>
      {label && <ArrowLabelText style={{ color: cfg.text }}>{label}</ArrowLabelText>}
      {description && <ArrowDescText style={{ color: cfg.text }}>{description}</ArrowDescText>}
    </ArrowContentBox>
  );

  if (shape === 'none') {
    return (
      <SmoothBox
        smoothRadius={theme.customBorderRadius.default}
        sx={{ position: 'relative', width, height, flexShrink: 0, ...sx }}
        style={{ backgroundColor: cfg.fill, border: `1px solid ${cfg.stroke}`, opacity: cfg.opacity }}
        {...props}
      >
        {content}
      </SmoothBox>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', width, height, flexShrink: 0, opacity: cfg.opacity, ...sx }}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${actualW} ${height}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <path
          d={pathD ?? undefined}
          fill={cfg.fill}
          stroke={cfg.stroke}
          strokeWidth={1}
          strokeLinejoin="round"
        />
      </svg>
      {content}
    </Box>
  );
}
