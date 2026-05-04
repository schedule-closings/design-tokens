'use client';

import React from 'react';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import { ToggleHandle, ToggleRoot, ToggleTrack } from './Toggle.styles';

export type ToggleSize = 'xs' | 'sm' | 'md' | 'lg';
export type ToggleStyle = 'inner' | 'offset';

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: ToggleSize;
  style?: ToggleStyle;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

const sizes: Record<
  string,
  { width: number; height: number; trackY: number; handle: number; hInset: number; leftOff: number; leftOn: number }
> = {
  xs: { width: 20, height: 20, trackY: 3, handle: 10, hInset: 5, leftOff: 2, leftOn: 8 },
  xsOffset: { width: 20, height: 20, trackY: 5, handle: 12, hInset: 4, leftOff: 0, leftOn: 8 },
  sm: { width: 28, height: 18, trackY: 2, handle: 14, hInset: 2, leftOff: 2, leftOn: 12 },
  md: { width: 40, height: 24, trackY: 3, handle: 20, hInset: 2, leftOff: 2, leftOn: 18 },
  lg: { width: 48, height: 28, trackY: 3, handle: 24, hInset: 2, leftOff: 2, leftOn: 22 },
};

export default function Toggle({
  checked = false,
  onChange,
  size = 'sm',
  style = 'inner',
  disabled = false,
  sx,
  ...props
}: ToggleProps) {
  const theme = useTheme();
  const isOffset = style === 'offset';
  const s = sizes[size === 'xs' && isOffset ? 'xsOffset' : size] ?? sizes.sm;
  const useFullHeight = isOffset && size !== 'xs';
  const handleWidth = useFullHeight ? s.height : s.handle;
  const handleHInset = useFullHeight ? 0 : s.hInset;
  const handleLeftOn = useFullHeight ? s.width - s.height : s.leftOn;
  const handleLeftOff = useFullHeight ? 0 : s.leftOff;
  const trackTopBottom = isOffset || size === 'xs' ? s.trackY : 0;
  const handleShadow = isOffset ? theme.customShadows.md : theme.customShadows.base;

  function handleClick() {
    if (!disabled) onChange?.(!checked);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <ToggleRoot
      component="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      isDisabled={disabled}
      sx={sx}
      style={{
        width: s.width,
        height: s.height,
        '--track-top': `${trackTopBottom}px`,
        '--handle-w': `${handleWidth}px`,
        '--handle-inset': `${handleHInset}px`,
        '--handle-left': checked ? `${handleLeftOn}px` : `${handleLeftOff}px`,
        '--handle-shadow': handleShadow,
      } as React.CSSProperties}
      {...props}
    >
      <ToggleTrack aria-hidden="true" isChecked={checked} isOffset={isOffset} />
      <ToggleHandle aria-hidden="true" />
    </ToggleRoot>
  );
}
