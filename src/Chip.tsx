'use client';

/**
 * Chip - SV Design System
 * Source: Figma file OVjygxh5hpVujmD1gl4MB9, node 1176-1998
 *
 * A standalone pill-shaped chip. Four style variants (filled/outline/ghost).
 * When `onRemove` is provided, switches to tag mode with a remove button.
 *
 * Props:
 *   label     - string    - chip text
 *   style     - 'filled' | 'outline' | 'ghost'   default: 'filled'
 *   leftIcon  - ReactNode - optional left icon
 *   rightIcon - ReactNode - optional right icon, ignored in tag mode
 *   onRemove  - func      - enables tag mode
 *   disabled  - bool      - default: false
 *   onClick   - func      - makes chip interactive
 */

import React, { useRef, useState } from 'react';
import MuiTooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/material/styles';
import { CloseFilledIcon } from './icons';
import { ChipRoot, ChipLabel, ChipIconBox, ChipRemoveButton, resolveChipTextColor } from './Chip.styles';
import type { ChipColor, ChipStyleVariant } from './Chip.styles';

export type { ChipColor } from './Chip.styles';

export interface ChipProps {
  label: string;
  style?: 'filled' | 'outline' | 'ghost' | 'duotone';
  size?: 'base' | 'mid' | 'small' | 'overline';
  color?: ChipColor;
  bold?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRemove?: () => void;
  disabled?: boolean;
  onClick?: () => void;
  /** When true, chip text never truncates (no ellipsis). Used by TagField/TagSelectField. */
  noTruncate?: boolean;
}

// Component

export default function Chip({
  label,
  style = 'filled',
  size = 'base',
  color = 'default',
  bold = false,
  leftIcon,
  rightIcon,
  onRemove,
  disabled = false,
  onClick,
  noTruncate = false,
}: ChipProps) {
  const theme = useTheme();
  const isMid = size === 'mid';
  const isSmall = size === 'small';
  const isOverline = size === 'overline';
  const isCompact = isSmall || isOverline;
  const isTagMode = Boolean(onRemove);
  const textColor = resolveChipTextColor(style as ChipStyleVariant, isTagMode ? 'default' : color, isTagMode, theme);

  // Overflow detection for truncation tooltip; check on hover for reliable timing.
  const labelRef = useRef<HTMLElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    const el = labelRef.current;
    if (el && el.scrollWidth > el.offsetWidth) {
      setShowTooltip(true);
    }
  };
  const handleMouseLeave = () => setShowTooltip(false);

  const chipContent = (
    <ChipRoot
      component={onClick ? 'button' : 'div'}
      onClick={onClick}
      disabled={onClick ? disabled : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      compact={isCompact}
      isTagMode={isTagMode}
      isButton={Boolean(onClick)}
      noTruncate={noTruncate}
      chipStyle={style as ChipStyleVariant}
      chipColor={isTagMode ? 'default' : color}
      isDisabled={disabled}
    >
      {/* Left icon */}
      {leftIcon && (
        <ChipIconBox compact={isCompact}>{leftIcon}</ChipIconBox>
      )}

      {/* Label */}
      <ChipLabel
        ref={labelRef}
        component="span"
        noTruncate={noTruncate}
        style={{
          ...(isOverline ? theme.customTypography.overline : (isSmall || isMid) ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
          ...(bold && { fontWeight: theme.fontWeights.semibold }),
          color: textColor,
        }}
      >
        {label}
      </ChipLabel>

      {/* Tag mode: remove button */}
      {isTagMode && (
        <ChipRemoveButton
          component="button"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label={`Remove ${label}`}
          compact={isCompact}
        >
          <CloseFilledIcon size={isCompact ? 16 : 20} color={theme.semantic.text.secondary} />
        </ChipRemoveButton>
      )}

      {/* Right icon (only when not tag mode) */}
      {!isTagMode && rightIcon && (
        <ChipIconBox compact={isCompact}>{rightIcon}</ChipIconBox>
      )}
    </ChipRoot>
  );

  return (
    <MuiTooltip
      title={label}
      placement="top"
      arrow
      open={showTooltip}
      disableHoverListener
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 0 }}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: theme.semantic.common.black,
            color: theme.semantic.common.white,
            fontSize: 14,
            fontWeight: theme.fontWeights.medium,
            borderRadius: theme.customBorderRadius.lg,
            px: theme.customSpacing[3],
            py: theme.customSpacing[1.5],
            boxShadow: 'none',
          },
        },
        arrow: { sx: { color: theme.semantic.common.black, '&::before': { border: 'none', backgroundColor: theme.semantic.common.black } } },
      }}
    >
      {chipContent}
    </MuiTooltip>
  );
}
