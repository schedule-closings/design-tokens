'use client';

/**
 * ComboField — SV Design System
 * Source: Figma file OVjygxh5hpVujmD1gl4MB9, node 1138-2377
 *
 * A single bordered container combining a free-text input (left) with an
 * inline select trigger (right) that opens a children-slot dropdown.
 *
 * Props:
 *   label          — string    — label above trigger (omit to hide)
 *   tooltip        — string    — <IconTooltip> on label row; or far-right of trigger when no label
 *   leftIcon       — ReactNode — optional icon left of text input
 *   placeholder    — string    — input placeholder  (default: "Placeholder Text")
 *   inputValue     — string    — controlled text input value
 *   onInputChange  — func      — (value: string) => void
 *   optionLabel    — string    — text shown in the right column button (default: "Option Label")
 *   onOptionClick  — func      — () => void — called when right column button is clicked
 *   disabled       — bool      — default: false
 *   children       — ReactNode — slot rendered inside the dropdown panel
 */

import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import SmoothBox from './SmoothBox';
import IconTooltip from './IconTooltip';
import { ChevronDownIcon } from './icons';
import { useTheme } from '@mui/material/styles';
import { useDropdownPlacement } from './useDropdownPlacement';
import { useInheritedColorMode } from './useInheritedColorMode';
import {
  ComboWrapper,
  ComboLabelRow,
  ComboLabelText,
  ComboRequiredMark,
  ComboTrigger,
  ComboInputSection,
  ComboInputBase,
  ComboDivider,
  ComboLeftIconBox,
  ComboOptionLabelText,
  ComboInlineTooltipWrapper,
  ComboOptionButtonWithTooltipGap,
} from './ComboField.styles';

type ColorModePaperSlotProps = NonNullable<React.ComponentProps<typeof Popover>['slotProps']>['paper'] & {
  'data-color-mode'?: 'light' | 'dark';
};

function getColorModePaperProps(
  mode: 'light' | 'dark' | undefined,
  sx: Record<string, unknown>,
): ColorModePaperSlotProps {
  return {
    ...(mode ? { 'data-color-mode': mode } : {}),
    sx,
  } as ColorModePaperSlotProps;
}

export interface ComboFieldProps {
  label?: string;
  hideLabel?: boolean;
  tooltip?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  placeholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  optionLabel?: string;
  onOptionClick?: () => void;
  disabled?: boolean;
  size?: 'base' | 'small';
  children?: React.ReactNode;
  [key: string]: unknown;
}

// Dropdown panel

interface PopoverDropdownProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children?: React.ReactNode;
}

function PopoverDropdown({ open, anchorEl, onClose, children }: PopoverDropdownProps) {
  const theme = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { placement, maxHeight } = useDropdownPlacement(anchorEl, { open });
  const isTop = placement === 'top';
  const inheritedMode = useInheritedColorMode(anchorEl, open);

  useEffect(() => {
    if (open && dropdownRef.current) dropdownRef.current.focus();
  }, [open]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: isTop ? 'top' : 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: isTop ? 'bottom' : 'top', horizontal: 'right' }}
      slotProps={{
        paper: getColorModePaperProps(inheritedMode, {
            mt: isTop ? 0 : theme.customSpacing[1],
            mb: isTop ? theme.customSpacing[1] : 0,
            borderRadius: theme.customBorderRadius.xl,
            overflow: 'visible',
            boxShadow: 'none',
            bgcolor: theme.semantic.common.white,
            backgroundImage: theme.surfaceOverlay.high,
        }),
      }}
    >
      <SmoothBox
        ref={dropdownRef}
        tabIndex={-1}
        smoothRadius={theme.customBorderRadius.xl}
        sx={{
          outline: 'none',
          bgcolor: theme.semantic.common.white,
          backgroundImage: theme.surfaceOverlay.high,
          boxShadow: theme.customShadows.lg,
          border: `1px solid ${theme.semantic.divider}`,
          minWidth: 'max-content',
          p: theme.customSpacing[4],
          maxHeight,
          overflowY: 'auto',
        }}
      >
        {children}
      </SmoothBox>
    </Popover>
  );
}

// Component

export default function ComboField({
  label,
  hideLabel,
  tooltip,
  required = false,
  leftIcon,
  placeholder = 'Placeholder Text',
  inputValue = '',
  onInputChange,
  optionLabel = 'Option Label',
  onOptionClick,
  disabled = false,
  size = 'base',
  children,
  ...props
}: ComboFieldProps) {
  const theme = useTheme();
  const isSmall = size === 'small';
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const isFocusedOrOpen = isFocused || open;
  const iconSz = isSmall ? 16 : 20;

  const handleOptionClick = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    onOptionClick?.();
  };

  return (
    <ComboWrapper data-annotation-target="ComboField" {...props}>
      {label && !hideLabel && (
        <ComboLabelRow>
          <ComboLabelText>{label}</ComboLabelText>
          {required && <ComboRequiredMark component="span">*</ComboRequiredMark>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </ComboLabelRow>
      )}

      <Box ref={anchorRef}>
        <ComboTrigger isFocused={isFocusedOrOpen} isDisabled={disabled} isBase={!isSmall}>
          <ComboInputSection>
            {leftIcon && (
              <ComboLeftIconBox iconSize={iconSz}>
                {leftIcon}
              </ComboLeftIconBox>
            )}
            <ComboInputBase
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </ComboInputSection>

          <ComboDivider />

          <ComboOptionButtonWithTooltipGap
            component="button"
            onClick={handleOptionClick}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-disabled={disabled}
            isOpen={open}
            isDisabled={disabled}
            hasTooltipGap={(!label || hideLabel) && Boolean(tooltip)}
          >
            <ComboOptionLabelText isSmall={isSmall} isFocusedOrOpen={isFocusedOrOpen}>
              {optionLabel}
            </ComboOptionLabelText>
            <span className="combo-chevron">
              <ChevronDownIcon size={iconSz} color={theme.semantic.text.secondary} />
            </span>
          </ComboOptionButtonWithTooltipGap>

          {(!label || hideLabel) && tooltip && (
            <ComboInlineTooltipWrapper>
              <IconTooltip title={tooltip} size={iconSz} />
            </ComboInlineTooltipWrapper>
          )}
        </ComboTrigger>
      </Box>

      <PopoverDropdown open={open} anchorEl={anchorRef.current} onClose={() => setOpen(false)}>
        {children}
      </PopoverDropdown>
    </ComboWrapper>
  );
}
