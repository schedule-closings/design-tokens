'use client';

/**
 * SelectField — SV Design System single-select dropdown.
 * Source: Figma file OVjygxh5hpVujmD1gl4MB9, node 875-1304
 *
 * Props:
 *   variant      "default" | "ghost" | "outline"           default: "default"
 *   size         "base" | "small"                          default: "base"
 *   label        string                                    optional label above trigger
 *   placeholder  string                                    default: "Option 1"
 *   value        string | null                             controlled selected value
 *   onChange     (value: string) => void
 *   options      Array<{ value: string, label: string }>   dropdown options
 *   leftIcon     ReactNode                                 optional left icon
 *   error        string                                    optional error message
 *   errorIcon    ReactNode                                 icon in error row (default <WarningOutlineIcon />)
 *   tooltip      string                                    optional tooltip
 *   disabled     bool                                      default: false
 */

import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import SmoothBox from './SmoothBox';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import { ChevronDownIcon, CheckDoubleIcon, CheckmarkIcon, WarningOutlineIcon } from './icons';
import { useDropdownPlacement } from './useDropdownPlacement';
import { useInheritedColorMode } from './useInheritedColorMode';
import {
  FieldLabelRowSpaced,
  FieldLabelText,
  FieldRequiredMark,
  FieldErrorRow,
  FieldErrorText,
  SelectTrigger,
  SelectChevron,
  DropdownOption,
  DropdownOptionText,
  SelectFieldRoot,
  SelectFieldInlineRoot,
  ListboxWrapper,
  CheckIconSpan,
  PopoverCheckIconSpan,
  LeftIconSpan,
  DisplayText,
  InlineTooltipSpan,
  LeftIconFlexSpan,
  OutlineTrigger,
  OutlineDisplayText,
  OutlineChevronSpan,
  OutlineDropdownOption,
  OutlineDropdownOptionText,
  GhostTrigger,
  GhostDisplayText,
  GhostChevronSpan,
  GhostAnchorWrapper,
} from './SelectField.styles';

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

// Shared FieldOption type — imported by other field components
export interface FieldOption {
  value: string;
  /**
   * Primary label. Shown both in the dropdown listbox and (by default) in
   * the trigger text once the option is selected.
   */
  label: string;
  /**
   * Optional secondary label shown after the primary in the dropdown listbox
   * only, wrapped in parentheses and rendered in `text.secondary`.
   * Reference use-case: state pickers — primary "North Carolina",
   * secondary "NC", rendered as "North Carolina (NC)" with the parenthetical
   * muted.
   */
  secondaryLabel?: string;
  /**
   * Optional override for the trigger text when the option is selected.
   * Used when the trigger has tighter visual constraints than the dropdown
   * (e.g. a compact 80px state filter that needs the code-only "NC" in the
   * trigger but the full "North Carolina (NC)" in the dropdown).
   */
  triggerLabel?: string;
  /**
   * Optional icon shown to the left of the label in the dropdown listbox
   * row only (NOT in the trigger). Use for color-coded swatches such as
   * the Live / Standalone status of an office picker.
   */
  leftIcon?: React.ReactNode;
}

export interface SelectFieldProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'base' | 'small';
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  options?: FieldOption[];
  leftIcon?: React.ReactNode;
  /**
   * Override the trigger's dropdown-indicator icon. Defaults to
   * `<ChevronDownIcon>`. Useful when embedding SelectField in another
   * field shell that wants a different visual (e.g. `<CaretDownIcon>`
   * to match a neighboring picker).
   */
  triggerIcon?: React.ReactNode;
  error?: string;
  errorIcon?: React.ReactNode;
  tooltip?: string;
  required?: boolean;
  disabled?: boolean;
  showCheckIcon?: boolean;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

// Popover dropdown — proper component so hooks are legal

interface PopoverDropdownProps {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  handleClose: () => void;
  options: FieldOption[];
  value?: string | null;
  handleSelect: (value: string) => void;
  iconSize: number;
  showCheckIcon?: boolean;
}

function PopoverDropdown({
  anchorRef,
  isOpen,
  handleClose,
  options,
  value,
  handleSelect,
  iconSize,
  showCheckIcon = false,
}: PopoverDropdownProps) {
  const theme = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { placement, maxHeight } = useDropdownPlacement(anchorRef.current, { open: isOpen });
  const isTop = placement === 'top';
  const inheritedMode = useInheritedColorMode(anchorRef.current, isOpen);

  useEffect(() => {
    if (isOpen && dropdownRef.current) dropdownRef.current.focus();
  }, [isOpen]);

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorRef.current}
      onClose={handleClose}
      anchorOrigin={{ vertical: isTop ? 'top' : 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: isTop ? 'bottom' : 'top', horizontal: 'left' }}
      disablePortal={false}
      slotProps={{
        paper: getColorModePaperProps(inheritedMode, {
            borderRadius: theme.customBorderRadius.xl,
            overflow: 'visible',
            boxShadow: 'none',
            mt: isTop ? 0 : theme.customSpacing[1],
            mb: isTop ? theme.customSpacing[1] : 0,
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
          py: theme.customSpacing[1],
          maxHeight,
          overflowY: 'auto',
        }}
      >
        <ListboxWrapper role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <DropdownOption
                key={option.value}
                role="option"
                aria-selected={isSelected}
                isSelected={isSelected}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(option.value);
                  }
                }}
                tabIndex={0}
              >
                <DropdownOptionText className="option-text">
                  {option.leftIcon && (
                    <Box
                      component="span"
                      sx={{ display: 'inline-flex', alignItems: 'center', mr: theme.customSpacing[2], flexShrink: 0 }}
                    >
                      {option.leftIcon}
                    </Box>
                  )}
                  {option.label}
                  {option.secondaryLabel && (
                    <Box
                      component="span"
                      sx={{ color: theme.semantic.text.secondary, ml: theme.customSpacing[1] }}
                    >
                      ({option.secondaryLabel})
                    </Box>
                  )}
                </DropdownOptionText>
                {showCheckIcon && isSelected && (
                  <PopoverCheckIconSpan>
                    <CheckDoubleIcon size={iconSize} color={theme.semantic.primary.main} />
                  </PopoverCheckIconSpan>
                )}
              </DropdownOption>
            );
          })}
        </ListboxWrapper>
      </SmoothBox>
    </Popover>
  );
}

// Component

export default function SelectField({
  variant = 'default',
  size = 'base',
  label,
  hideLabel,
  placeholder = 'Option 1',
  value = null,
  onChange,
  options = [],
  leftIcon,
  triggerIcon,
  error,
  errorIcon,
  tooltip,
  required = false,
  disabled = false,
  showCheckIcon = false,
  sx,
  ...props
}: SelectFieldProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { placement, maxHeight } = useDropdownPlacement(anchorRef.current, { open: isOpen });
  const isTop = placement === 'top';
  const inheritedMode = useInheritedColorMode(anchorRef.current, isOpen);

  const isError = Boolean(error && !disabled);
  const hasValue = value !== null && value !== undefined && value !== '';
  const isBase = size === 'base';
  const isGhost = variant === 'ghost';
  const isOutline = variant === 'outline';

  // Prefer the option's `triggerLabel` (trigger-only override, used for
  // compact triggers like the 80px state filter) before falling back to
  // its primary `label`. The `secondaryLabel` is intentionally NOT rendered
  // in the trigger — it only decorates dropdown rows.
  const selectedOption = hasValue ? options.find((o) => o.value === value) : undefined;
  const selectedLabel = hasValue
    ? (selectedOption?.triggerLabel ?? selectedOption?.label ?? value)
    : null;
  const displayText = selectedLabel ?? placeholder;
  const isPlaceholder = !hasValue;

  const iconSize = isBase ? 20 : 16;

  function handleOpen(e: React.MouseEvent) {
    if (disabled) return;
    e.preventDefault();
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleSelect(optValue: string) {
    onChange?.(optValue);
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      else setIsOpen(false);
    }
    if (e.key === 'Escape') setIsOpen(false);
  }

  // Outline variant
  if (isOutline) {
    const outlineBorderColor = isOpen ? theme.semantic.text.primary : theme.semantic.action.disabled;
    const outlineShadow = isOpen ? theme.customShadows.focusPrimary : 'none';

    return (
      <SelectFieldInlineRoot sx={sx} {...props}>
        {label && !hideLabel && (
          <FieldLabelRowSpaced isBase={isBase}>
            <FieldLabelText isSmall={!isBase}>{label}</FieldLabelText>
            {required && <FieldRequiredMark component="span" isSmall={!isBase}>*</FieldRequiredMark>}
            {tooltip && <IconTooltip title={tooltip} size={18} />}
          </FieldLabelRowSpaced>
        )}
        <div ref={anchorRef}>
          <OutlineTrigger
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            disabled={disabled}
            isOpen={isOpen}
            isDisabled={disabled}
            outlineBorderColor={outlineBorderColor}
            outlineShadow={outlineShadow}
          >
            {leftIcon && <LeftIconFlexSpan>{leftIcon}</LeftIconFlexSpan>}
            <OutlineDisplayText isPlaceholder={isPlaceholder}>
              {displayText}
            </OutlineDisplayText>
            <OutlineChevronSpan isOpen={isOpen}>
              {triggerIcon ?? <ChevronDownIcon size={16} color="currentColor" />}
            </OutlineChevronSpan>
          </OutlineTrigger>
        </div>
        <Popover
          open={isOpen}
          anchorEl={anchorRef.current}
          onClose={handleClose}
          anchorOrigin={{ vertical: isTop ? 'top' : 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: isTop ? 'bottom' : 'top', horizontal: 'left' }}
          slotProps={{
            paper: getColorModePaperProps(inheritedMode, {
                mt: isTop ? 0 : theme.customSpacing[1],
                mb: isTop ? theme.customSpacing[1] : 0,
                borderRadius: theme.customBorderRadius.xl,
                border: `1px solid ${theme.semantic.divider}`,
                boxShadow: theme.customShadows.lg,
                backgroundImage: theme.surfaceOverlay.high,
                bgcolor: theme.semantic.common.white,
                minWidth: 'max-content',
                py: theme.customSpacing[1],
                maxHeight,
                overflowY: 'auto',
            }),
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <OutlineDropdownOption
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                isSelected={isSelected}
              >
                <OutlineDropdownOptionText isSelected={isSelected}>
                  {opt.leftIcon && (
                    <Box
                      component="span"
                      sx={{ display: 'inline-flex', alignItems: 'center', mr: theme.customSpacing[2], flexShrink: 0 }}
                    >
                      {opt.leftIcon}
                    </Box>
                  )}
                  {opt.label}
                  {opt.secondaryLabel && (
                    <Box
                      component="span"
                      sx={{ color: theme.semantic.text.secondary, ml: theme.customSpacing[1] }}
                    >
                      ({opt.secondaryLabel})
                    </Box>
                  )}
                </OutlineDropdownOptionText>
                {showCheckIcon && isSelected && <CheckmarkIcon size={16} color={theme.semantic.primary.main} />}
              </OutlineDropdownOption>
            );
          })}
        </Popover>
      </SelectFieldInlineRoot>
    );
  }

  // Ghost variant
  if (isGhost) {
    return (
      <SelectFieldInlineRoot sx={sx} {...props}>
        {label && !hideLabel && (
          <FieldLabelRowSpaced isBase={isBase}>
            <FieldLabelText isSmall={!isBase}>{label}</FieldLabelText>
            {required && <FieldRequiredMark component="span" isSmall={!isBase}>*</FieldRequiredMark>}
            {tooltip && <IconTooltip title={tooltip} size={18} />}
          </FieldLabelRowSpaced>
        )}

        <GhostAnchorWrapper ref={anchorRef}>
          <GhostTrigger
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            isBase={isBase}
            isDisabled={disabled}
            isPlaceholder={isPlaceholder}
          >
            <GhostDisplayText isBase={isBase}>
              {displayText}
            </GhostDisplayText>
            <GhostChevronSpan isOpen={isOpen}>
              {triggerIcon ?? (
                <ChevronDownIcon size={iconSize} color={theme.semantic.text.secondary} />
              )}
            </GhostChevronSpan>
          </GhostTrigger>
        </GhostAnchorWrapper>

        <PopoverDropdown
          anchorRef={anchorRef}
          isOpen={isOpen}
          handleClose={handleClose}
          options={options}
          value={value}
          handleSelect={handleSelect}
          iconSize={iconSize}
          showCheckIcon={showCheckIcon}
        />
      </SelectFieldInlineRoot>
    );
  }

  // Default variant
  return (
    <SelectFieldRoot data-annotation-target="SelectField" sx={sx} {...props}>
      {label && !hideLabel && (
        <FieldLabelRowSpaced isBase={isBase}>
          <FieldLabelText isSmall={!isBase}>{label}</FieldLabelText>
          {required && <FieldRequiredMark component="span" isSmall={!isBase}>*</FieldRequiredMark>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </FieldLabelRowSpaced>
      )}

      <Box ref={anchorRef}>
        <SelectTrigger
          component="button"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          isError={isError}
          isOpen={isOpen}
          isDisabled={disabled}
          isBase={isBase}
          sx={leftIcon && isBase ? { pl: theme.customSpacing[3] } : undefined}
        >
          {leftIcon && (
            <LeftIconSpan iconSize={iconSize}>
              {leftIcon}
            </LeftIconSpan>
          )}

          <DisplayText isBase={isBase} isPlaceholder={isPlaceholder}>
            {displayText}
          </DisplayText>

          {showCheckIcon && hasValue && (
            <CheckIconSpan>
              <CheckDoubleIcon size={iconSize} color={theme.semantic.text.secondary} />
            </CheckIconSpan>
          )}

          <SelectChevron component="span" isOpen={isOpen}>
            {triggerIcon ?? (
              <ChevronDownIcon size={iconSize} color={theme.semantic.text.secondary} />
            )}
          </SelectChevron>

          {tooltip && !label && (
            <InlineTooltipSpan>
              <IconTooltip title={tooltip} size={iconSize} />
            </InlineTooltipSpan>
          )}
        </SelectTrigger>
      </Box>

      {isError && (
        <FieldErrorRow>
          {errorIcon ?? <WarningOutlineIcon size={16} color={theme.semantic.error.main} />}
          <FieldErrorText>{error}</FieldErrorText>
        </FieldErrorRow>
      )}

      <PopoverDropdown
        anchorRef={anchorRef}
        isOpen={isOpen}
        handleClose={handleClose}
        options={options}
        value={value}
        handleSelect={handleSelect}
        iconSize={iconSize}
        showCheckIcon={showCheckIcon}
      />
    </SelectFieldRoot>
  );
}
