'use client';

/**
 * DurationField — SV Design System duration input.
 *
 * A single field for entering a duration or offset as an amount + unit.
 * Replaces the common "N preset values in a Select" pattern (e.g.
 * "15m / 30m / 45m / 60m") with free-form numeric entry bounded by
 * min / max / step, plus a unit that can be fixed (e.g. always minutes)
 * or user-selectable (e.g. minute / hour / day).
 *
 * Canonical value: `{ amount: number, unit: DurationUnit }`. Consumers
 * can format it however they need for display or persistence.
 *
 * Props:
 *   value         Duration | null                      canonical value
 *   onChange      (value: Duration) => void            fires on every change
 *   amountMode    "input" | "select"     default "input"
 *                                         input  — numeric text input (free entry)
 *                                         select — SelectField whose options are
 *                                                  auto-generated from min/max/step
 *                                                  and rendered as "N <unit>" (e.g.
 *                                                  "15 min", "30 min"). Requires a
 *                                                  fixed unit (allowedUnits[0]).
 *   unitMode      "fixed" | "select"     default "fixed"
 *                                         fixed — unit renders as a static suffix
 *                                         select — inline dropdown over allowedUnits
 *                                         Ignored when amountMode === "select"
 *                                         (select mode uses the fixed unit).
 *   allowedUnits  DurationUnit[]          default ['minute','hour','day']
 *                                         Options shown when unitMode === "select";
 *                                         also the unit used for "fixed" when `value`
 *                                         is null (first entry wins).
 *   min           number                                lower bound (also drives the
 *                                                      first option in select mode)
 *   max           number                                upper bound (also drives the
 *                                                      last option in select mode)
 *   step          number                  default 1    numeric step. In select mode,
 *                                                      acts as the interval between
 *                                                      generated options.
 *   label         string                                optional label row
 *   hideLabel     boolean                                hide the label row
 *   helperText    string                                helper text below box
 *   error         boolean|string                        error state / message
 *   disabled      boolean                                default false
 *   placeholder   string                                placeholder for empty input
 *   required      boolean                                shows red asterisk
 *   tooltip       string                                IconTooltip after label
 *   errorIcon     ReactNode                              overrides WarningOutlineIcon
 *   size          "base" | "small"        default "base"
 *   variant       "default" | "ghost"     default "default"
 *   sx            MUI SxProps                           extra styles on outer Box
 */

import React, { useMemo, useRef, useState } from 'react';
import Popover from '@mui/material/Popover';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import SelectField from './SelectField';
import SmoothBox from './SmoothBox';
import { CaretDownIcon, WarningOutlineIcon } from './icons';
import { useDropdownPlacement } from './useDropdownPlacement';
import { useInheritedColorMode } from './useInheritedColorMode';
import {
  DurationFieldOuterBox,
  DurationFieldLabelRow,
  DurationFieldLabelText,
  DurationFieldRequiredMark,
  DurationFieldContainer,
  DurationFieldAmountInput,
  DurationFieldUnitAdornment,
  DurationFieldUnitText,
  DurationFieldUnitButton,
  DurationFieldUnitOption,
  DurationFieldHelperText,
  DurationFieldErrorRow,
  DurationFieldErrorText,
} from './DurationField.styles';

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

export type DurationUnit = 'minute' | 'hour' | 'day' | 'week';

export interface Duration {
  amount: number;
  unit: DurationUnit;
}

/** Compact abbreviations used for display. Kept short to fit in table cells. */
const UNIT_LABEL_SHORT: Record<DurationUnit, string> = {
  minute: 'min',
  hour: 'hr',
  day: 'day',
  week: 'wk',
};

/** Long labels for the select-mode dropdown — more legible than abbreviations. */
const UNIT_LABEL_LONG: Record<DurationUnit, string> = {
  minute: 'minutes',
  hour: 'hours',
  day: 'days',
  week: 'weeks',
};

export interface DurationFieldProps {
  value?: Duration | null;
  onChange?: (value: Duration) => void;
  amountMode?: 'input' | 'select';
  unitMode?: 'fixed' | 'select';
  allowedUnits?: DurationUnit[];
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  hideLabel?: boolean;
  helperText?: string;
  error?: boolean | string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  tooltip?: string;
  errorIcon?: React.ReactNode;
  size?: 'base' | 'small';
  variant?: 'default' | 'ghost';
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export default function DurationField({
  value = null,
  onChange,
  amountMode = 'input',
  unitMode = 'fixed',
  allowedUnits = ['minute', 'hour', 'day'],
  min,
  max,
  step = 1,
  label,
  hideLabel,
  helperText,
  error = false,
  disabled = false,
  placeholder,
  required = false,
  tooltip,
  errorIcon,
  size = 'base',
  variant = 'default',
  sx,
  ...props
}: DurationFieldProps) {
  const theme = useTheme();
  const isSmall = size === 'small';
  const isGhost = variant === 'ghost';
  const [isFocused, setIsFocused] = useState(false);
  const [unitPopoverOpen, setUnitPopoverOpen] = useState(false);
  const unitAnchorRef = useRef<HTMLButtonElement>(null);
  const unitPopoverInheritedMode = useInheritedColorMode(
    unitAnchorRef.current,
    unitPopoverOpen,
  );
  const { placement: unitPopoverPlacement } = useDropdownPlacement(
    unitAnchorRef.current,
    { open: unitPopoverOpen, minSpace: 160 },
  );
  const isUnitPopoverTop = unitPopoverPlacement === 'top';

  const isError = Boolean(error && !disabled);
  const errorMessage = typeof error === 'string' ? error : 'Invalid duration';

  // Resolve the active unit. When the consumer hasn't provided a value yet,
  // fall back to the first entry in `allowedUnits` so the "fixed" adornment
  // always has something to render.
  const activeUnit: DurationUnit = value?.unit ?? allowedUnits[0] ?? 'minute';
  const amountInput = value?.amount ?? null;

  function emit(next: { amount?: number; unit?: DurationUnit }) {
    onChange?.({
      amount: next.amount ?? amountInput ?? 0,
      unit: next.unit ?? activeUnit,
    });
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === '') {
      emit({ amount: 0 });
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    emit({ amount: parsed });
  }

  function handleUnitChange(nextUnit: unknown) {
    if (typeof nextUnit !== 'string') return;
    emit({ unit: nextUnit as DurationUnit });
  }

  /**
   * Options for amountMode="select". Generated from min/max/step — each
   * multiple of `step` between `min` and `max` (inclusive) becomes one
   * option, displayed as "<N> <unit-short>" (e.g. "15 min"). Falls back
   * to a sensible 1..60 range when bounds are missing.
   */
  const amountSelectOptions = useMemo(() => {
    if (amountMode !== 'select') return [];
    const lo = min ?? 1;
    const hi = max ?? 60;
    const iv = Math.max(1, step || 1);
    const unitLabel = UNIT_LABEL_SHORT[activeUnit];
    const options: { value: string; label: string }[] = [];
    for (let n = lo; n <= hi; n += iv) {
      options.push({ value: String(n), label: `${n} ${unitLabel}` });
    }
    // Guarantee the current value is reachable even if it sits off the grid
    // (e.g. a legacy row saved with step=5 and the column later changed to
    // step=15). Insert it in sorted order so the dropdown stays intuitive.
    if (amountInput != null && amountInput >= lo && amountInput <= hi) {
      const exists = options.some((o) => o.value === String(amountInput));
      if (!exists) {
        options.push({ value: String(amountInput), label: `${amountInput} ${unitLabel}` });
        options.sort((a, b) => Number(a.value) - Number(b.value));
      }
    }
    return options;
  }, [amountMode, min, max, step, activeUnit, amountInput]);

  function handleAmountSelectChange(next: unknown) {
    if (typeof next !== 'string') return;
    const parsed = Number(next);
    if (Number.isNaN(parsed)) return;
    emit({ amount: parsed });
  }

  // Amount-as-select replaces the entire amount+unit box with a single
  // SelectField whose options already include the unit label, so we don't
  // also render the separate unit adornment/select below.
  if (amountMode === 'select') {
    return (
      <DurationFieldOuterBox data-annotation-target="DurationField" sx={sx} {...props}>
        {label && !hideLabel && (
          <DurationFieldLabelRow>
            <DurationFieldLabelText>{label}</DurationFieldLabelText>
            {required && (
              <DurationFieldRequiredMark component="span">*</DurationFieldRequiredMark>
            )}
            {tooltip && <IconTooltip title={tooltip} size={18} />}
          </DurationFieldLabelRow>
        )}

        <SelectField
          hideLabel
          label={label ?? 'Duration'}
          size={isSmall ? 'small' : 'base'}
          variant={isGhost ? 'ghost' : 'default'}
          value={amountInput != null ? String(amountInput) : ''}
          onChange={handleAmountSelectChange}
          options={amountSelectOptions}
          disabled={disabled}
          placeholder={placeholder}
          triggerIcon={
            <CaretDownIcon
              size={isSmall ? 14 : 16}
              color={theme.semantic.text.secondary}
            />
          }
        />

        {helperText && !isError && (
          <DurationFieldHelperText>{helperText}</DurationFieldHelperText>
        )}

        {isError && (
          <DurationFieldErrorRow>
            {errorIcon ?? <WarningOutlineIcon size={16} color={theme.semantic.error.main} />}
            <DurationFieldErrorText>{errorMessage}</DurationFieldErrorText>
          </DurationFieldErrorRow>
        )}
      </DurationFieldOuterBox>
    );
  }

  return (
    <DurationFieldOuterBox data-annotation-target="DurationField" sx={sx} {...props}>
      {label && !hideLabel && (
        <DurationFieldLabelRow>
          <DurationFieldLabelText>{label}</DurationFieldLabelText>
          {required && (
            <DurationFieldRequiredMark component="span">*</DurationFieldRequiredMark>
          )}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </DurationFieldLabelRow>
      )}

      <DurationFieldContainer
        isError={isError}
        isFocused={isFocused}
        isDisabled={disabled}
        isSmall={isSmall}
        isGhost={isGhost}
      >
        <DurationFieldAmountInput
          isSmall={isSmall}
          type="number"
          inputMode="numeric"
          inputProps={{ min, max, step, 'aria-label': label ?? 'Duration amount' }}
          value={amountInput ?? ''}
          onChange={handleAmountChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
        />

        {unitMode === 'fixed' ? (
          <DurationFieldUnitAdornment isSmall={isSmall}>
            <DurationFieldUnitText isSmall={isSmall}>
              {UNIT_LABEL_SHORT[activeUnit]}
            </DurationFieldUnitText>
          </DurationFieldUnitAdornment>
        ) : (
          <>
            <DurationFieldUnitButton
              ref={unitAnchorRef}
              type="button"
              isSmall={isSmall}
              isOpen={unitPopoverOpen}
              isDisabled={disabled}
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                setUnitPopoverOpen((v) => !v);
              }}
              aria-haspopup="listbox"
              aria-expanded={unitPopoverOpen}
              aria-label={`Unit: ${UNIT_LABEL_LONG[activeUnit]}`}
            >
              <DurationFieldUnitText isSmall={isSmall}>
                {UNIT_LABEL_LONG[activeUnit]}
              </DurationFieldUnitText>
              <span className="duration-chevron">
                <CaretDownIcon size={isSmall ? 14 : 16} color={theme.semantic.text.secondary} />
              </span>
            </DurationFieldUnitButton>

            <Popover
              open={unitPopoverOpen}
              anchorEl={unitAnchorRef.current}
              onClose={() => setUnitPopoverOpen(false)}
              anchorOrigin={{
                vertical: isUnitPopoverTop ? 'top' : 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: isUnitPopoverTop ? 'bottom' : 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: getColorModePaperProps(unitPopoverInheritedMode, {
                    mt: isUnitPopoverTop ? 0 : theme.customSpacing[1],
                    mb: isUnitPopoverTop ? theme.customSpacing[1] : 0,
                    borderRadius: theme.customBorderRadius.xl,
                    overflow: 'visible',
                    boxShadow: 'none',
                    bgcolor: theme.semantic.common.white,
                    backgroundImage: theme.surfaceOverlay.high,
                }),
              }}
            >
              <SmoothBox
                role="listbox"
                aria-label="Unit"
                tabIndex={-1}
                smoothRadius={theme.customBorderRadius.xl}
                sx={{
                  bgcolor: theme.semantic.common.white,
                  backgroundImage: theme.surfaceOverlay.high,
                  boxShadow: theme.customShadows.md,
                  border: `1px solid ${theme.semantic.divider}`,
                  padding: theme.customSpacing[1],
                  outline: 'none',
                  minWidth: 'max-content',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.customSpacing['0.5'],
                }}
              >
                {allowedUnits.map((u) => (
                  <DurationFieldUnitOption
                    key={u}
                    role="option"
                    aria-selected={u === activeUnit}
                    isSelected={u === activeUnit}
                    tabIndex={0}
                    onClick={() => {
                      handleUnitChange(u);
                      setUnitPopoverOpen(false);
                    }}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleUnitChange(u);
                        setUnitPopoverOpen(false);
                      }
                    }}
                  >
                    {UNIT_LABEL_LONG[u]}
                  </DurationFieldUnitOption>
                ))}
              </SmoothBox>
            </Popover>
          </>
        )}
      </DurationFieldContainer>

      {helperText && !isError && (
        <DurationFieldHelperText>{helperText}</DurationFieldHelperText>
      )}

      {isError && (
        <DurationFieldErrorRow>
          {errorIcon ?? <WarningOutlineIcon size={16} color={theme.semantic.error.main} />}
          <DurationFieldErrorText>{errorMessage}</DurationFieldErrorText>
        </DurationFieldErrorRow>
      )}
    </DurationFieldOuterBox>
  );
}
