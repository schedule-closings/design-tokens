'use client';

import React from 'react';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { SxProps, Theme } from '@mui/material/styles';
import { IconProps } from './icons';
import Spinner from './Spinner';
import { StyledButtonBase, ButtonIconWrap } from './BaseButton.styles';

/**
 * ButtonIcon -- internal wrapper for startIcon / endIcon slots.
 * Owns the container (matching Figma's icon slot) and forces the correct size
 * on the icon via React.cloneElement so sizing is always consistent regardless
 * of the size prop the icon was passed with. Each icon SVG bakes in its own
 * Figma inset via viewBox (same approach as AddIcon's inset-1/4 fix).
 */
interface ButtonIconProps {
  icon?: React.ReactElement | null;
  iconSize?: number;
}

function ButtonIcon({ icon, iconSize = 20 }: ButtonIconProps) {
  if (!icon) return null;
  return (
    <ButtonIconWrap
      component="span"
      sx={{ width: iconSize, height: iconSize }}
    >
      {React.cloneElement(icon as React.ReactElement<IconProps>, { size: iconSize })}
    </ButtonIconWrap>
  );
}

/**
 * BaseButton -- SV Design System button component.
 * Source: Figma file OVjygxh5hpVujmD1gl4MB9, node 650-1250
 *
 * Props:
 *   variant  -- "filled" | "outline" | "ghost"   (default: "filled")
 *   color    -- "primary" | "secondary" | "neutral"  (default: "primary")
 *   startIcon -- node rendered before children
 *   endIcon   -- node rendered after children
 *   sx        -- additional MUI sx overrides (kept for backward compat)
 *   ...props  -- passed to ButtonBase (component, href, onClick, aria-*, etc.)
 *
 * Padding rules (Figma spec):
 *   startIcon only -> pl:12px  pr:14px  py:12px
 *   endIcon only   -> pl:14px  pr:12px  py:12px
 *   both / none    -> px:12px  py:12px
 */

export type BaseButtonVariant = 'filled' | 'outline' | 'ghost' | 'duotone';
export type BaseButtonColor = 'primary' | 'secondary' | 'neutral' | 'success' | 'error' | 'alert' | 'warning';

export type BaseButtonSize = 'base' | 'small' | 'no-padding';

export interface BaseButtonProps extends Omit<ButtonBaseProps, 'color' | 'sx' | 'component'> {
  variant?: BaseButtonVariant;
  color?: BaseButtonColor;
  size?: BaseButtonSize;
  startIcon?: React.ReactElement | null;
  endIcon?: React.ReactElement | null;
  /**
   * When true, renders a Spinner at `spinnerPlacement` (default `'right'`)
   * matching the button's icon size. The spinner replaces the icon on that
   * side while active, so the button width doesn't jump.
   */
  spinner?: boolean;
  /** Which side the spinner sits on when `spinner` is true. Default `'right'`. */
  spinnerPlacement?: 'left' | 'right';
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  // Polymorphic component override (e.g. component={Link})
  component?: React.ElementType;
  // Link-compatible props when component is overridden to an anchor/Link
  href?: string;
}

export default function BaseButton({
  variant = 'filled',
  color = 'primary',
  size = 'base',
  startIcon,
  endIcon,
  spinner = false,
  spinnerPlacement = 'right',
  children,
  sx,
  ...props
}: BaseButtonProps) {
  const isSmall = size === 'small';
  const iconSize = isSmall ? 16 : 20;

  const spinnerNode = spinner ? <Spinner size={iconSize} /> : null;
  const leftNode = spinner && spinnerPlacement === 'left'
    ? spinnerNode
    : <ButtonIcon icon={startIcon} iconSize={iconSize} />;
  const rightNode = spinner && spinnerPlacement === 'right'
    ? spinnerNode
    : <ButtonIcon icon={endIcon} iconSize={iconSize} />;

  // Match Figma's padding rules: slot presence (icon OR spinner) drives padding.
  const hasLeftSlot = (spinner && spinnerPlacement === 'left') || !!startIcon;
  const hasRightSlot = (spinner && spinnerPlacement === 'right') || !!endIcon;

  return (
    <StyledButtonBase
      btnVariant={variant}
      btnColor={color}
      btnSize={size}
      hasStartIcon={hasLeftSlot}
      hasEndIcon={hasRightSlot}
      sx={sx}
      {...props}
    >
      {leftNode}
      {children}
      {rightNode}
    </StyledButtonBase>
  );
}
