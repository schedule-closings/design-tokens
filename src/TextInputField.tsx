'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Checkbox from './Checkbox';
import IconTooltip from './IconTooltip';
import {
  CheckDoubleIcon,
  CheckmarkIcon,
  CloseIcon,
  ViewFilledIcon,
  ViewOffFilledIcon,
  WarningOutlineIcon,
} from './icons';
import {
  InputBox,
  InputCriteriaBox,
  InputCriteriaRow,
  InputCriteriaText,
  InputErrorRow,
  InputErrorText,
  InputFieldWrapper,
  InputIconSlot,
  InputLabelRow,
  InputLabelText,
  InputLeftIconWrapperWithGap,
  InputRequiredMark,
  InputRightIconWrapperWithGap,
  InputStatusRow,
  InputStatusText,
  InputSuggestionLabelText,
  InputSuggestionMutedText,
  InputSuggestionRow,
  PwCriteriaNoWrapText,
  PwCriteriaTooltipBox,
  PwCriteriaTooltipRow,
  PwToggleButton,
  StyledInputBase,
} from './TextInputField.styles';

type FieldType = 'text' | 'email' | 'tel' | 'password';
type PasswordMode = 'new' | 'login' | 'confirm';

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  criteria?: PasswordCriteria;
}

export interface TextInputFieldSuggestion {
  value: string;
  label: string;
  mutedText?: string;
}

export interface TextInputFieldProps {
  type?: FieldType;
  passwordMode?: PasswordMode;
  matchValue?: string;
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: string;
  errorIcon?: React.ReactNode;
  checked?: boolean;
  tooltip?: string;
  validationMessage?: string;
  onValidChange?: (valid: boolean) => void;
  minLength?: number;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  suggestion?: TextInputFieldSuggestion;
  size?: 'base' | 'small';
  variant?: 'default' | 'ghost';
  sx?: SxProps<Theme>;
  inputProps?: Record<string, unknown>;
  [key: string]: unknown;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validate(type: FieldType, value: string, minLength?: number): ValidationResult {
  if (!value) return { valid: false };

  switch (type) {
    case 'email': {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      return { valid, error: valid ? undefined : 'Invalid email address' };
    }
    case 'tel': {
      const digits = value.replace(/\D/g, '');
      const valid = digits.length === 10;
      return { valid, error: valid ? undefined : 'Invalid mobile number' };
    }
    case 'password': {
      const criteria: PasswordCriteria = {
        length: value.length >= 12,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
      };
      const valid = criteria.length && criteria.uppercase && criteria.lowercase && criteria.number;
      return { valid, error: valid ? undefined : "Password doesn't meet the criteria", criteria };
    }
    default: {
      if (minLength && value.length < minLength) {
        return { valid: false, error: `Should be at least ${minLength} characters long` };
      }
      return { valid: true };
    }
  }
}

const passwordRules: { key: keyof PasswordCriteria; label: string }[] = [
  { key: 'length', label: 'At least 12 characters long' },
  { key: 'uppercase', label: 'Have at least one uppercase' },
  { key: 'lowercase', label: 'Have at least one lowercase' },
  { key: 'number', label: 'Have at least one number' },
];

function PasswordCriteriaContent({ criteria }: { criteria: PasswordCriteria }) {
  const theme = useTheme();

  return (
    <PwCriteriaTooltipBox>
      {passwordRules.map((rule) => (
        <PwCriteriaTooltipRow key={rule.key}>
          {criteria[rule.key] ? (
            <CheckmarkIcon size={16} color={theme.semantic.success.main} />
          ) : (
            <CloseIcon size={16} color={theme.semantic.error.main} />
          )}
          <PwCriteriaNoWrapText>{rule.label}</PwCriteriaNoWrapText>
        </PwCriteriaTooltipRow>
      ))}
    </PwCriteriaTooltipBox>
  );
}

export default function TextInputField({
  type = 'text',
  passwordMode = 'new',
  matchValue,
  label,
  hideLabel,
  placeholder,
  value = '',
  onChange,
  startIcon,
  endIcon,
  error,
  errorIcon,
  checked,
  tooltip,
  validationMessage,
  onValidChange,
  minLength,
  required = false,
  disabled = false,
  readOnly = false,
  suggestion,
  size = 'base',
  variant = 'default',
  sx,
  inputProps,
  ...props
}: TextInputFieldProps) {
  const theme = useTheme();
  const isSmall = size === 'small';
  const isGhost = variant === 'ghost';
  const isLoginPassword = type === 'password' && passwordMode === 'login';
  const isConfirmPassword = type === 'password' && passwordMode === 'confirm';
  const validationType: FieldType = isLoginPassword || isConfirmPassword ? 'text' : type;

  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const previousValid = useRef<boolean | null>(null);
  const iconSize = isSmall ? 16 : 20;

  const hasAutoValidation = validationType !== 'text' || Boolean(minLength) || isConfirmPassword;
  const validation = useMemo(
    () => validate(validationType, value, minLength),
    [validationType, value, minLength],
  );
  const matchValueValid = isConfirmPassword ? validate('password', matchValue ?? '').valid : true;
  const confirmValid = isConfirmPassword ? Boolean(value) && matchValueValid && value === matchValue : null;
  const confirmError =
    isConfirmPassword && (touched || isFocused) && value
      ? !matchValueValid
        ? 'Provide a valid password first'
        : !confirmValid
          ? 'Passwords do not match'
          : undefined
      : undefined;
  const effectiveValid = isConfirmPassword ? confirmValid ?? false : validation.valid;

  useEffect(() => {
    if (!hasAutoValidation || !onValidChange) return;
    if (previousValid.current !== effectiveValid) {
      previousValid.current = effectiveValid;
      onValidChange(effectiveValid);
    }
  }, [effectiveValid, hasAutoValidation, onValidChange]);

  const isNewPassword = type === 'password' && passwordMode === 'new';
  const newPasswordTyping = isNewPassword && isFocused && value.length > 0 && !validation.valid;
  const autoError = isConfirmPassword
    ? confirmError
    : hasAutoValidation && (touched || newPasswordTyping) && value && !validation.valid
      ? validationMessage ?? validation.error
      : undefined;
  const resolvedError = error ?? autoError;
  const isError = Boolean(resolvedError && !disabled);
  const suggestionChecked = Boolean(suggestion) && value === suggestion?.value && value !== '';
  const autoChecked = hasAutoValidation && (touched || suggestionChecked) && Boolean(value) && effectiveValid;
  const resolvedChecked = checked ?? (hasAutoValidation ? autoChecked : false);

  const liveCriteria = useMemo(() => {
    if (type !== 'password' || passwordMode !== 'new') return null;
    return validate('password', value).criteria ?? null;
  }, [type, passwordMode, value]);

  const passwordToggle = type === 'password' ? (
    <PwToggleButton
      component="button"
      onClick={() => setShowPassword((current) => !current)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? (
        <ViewOffFilledIcon size={iconSize} color={theme.semantic.text.secondary} />
      ) : (
        <ViewFilledIcon size={iconSize} color={theme.semantic.text.secondary} />
      )}
    </PwToggleButton>
  ) : null;

  const effectiveEndIcon =
    type === 'password'
      ? endIcon ?? passwordToggle
      : isError
        ? null
        : endIcon ?? (resolvedChecked ? <CheckDoubleIcon color={theme.semantic.success.main} /> : null);
  const hasLeft = Boolean(startIcon);
  const hasRight = Boolean(effectiveEndIcon);
  const inputPxBase = isSmall ? theme.customSpacing[3] : theme.customSpacing['3.5'];
  const inputPxIcon = isSmall ? theme.customSpacing[2] : theme.customSpacing[3];
  const inputPyToken = isSmall ? theme.customSpacing[2] : theme.customSpacing[3];
  const resolvedErrorIcon = errorIcon ?? (
    <WarningOutlineIcon size={iconSize} color={theme.semantic.error.main} />
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'tel') {
        const formatted = formatPhone(event.target.value);
        const syntheticEvent = {
          ...event,
          target: { ...event.target, value: formatted },
          nativeEvent: event.nativeEvent,
        };
        onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
        return;
      }

      onChange?.(event);
    },
    [type, onChange],
  );

  const emitSuggestionValue = useCallback(
    (nextValue: string) => {
      if (!onChange) return;
      onChange({
        target: { value: nextValue },
        currentTarget: { value: nextValue },
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    },
    [onChange],
  );

  const handleToggleSuggestion = useCallback(() => {
    if (!suggestion || disabled) return;
    setTouched(true);
    emitSuggestionValue(suggestionChecked ? '' : suggestion.value);
  }, [suggestion, disabled, suggestionChecked, emitSuggestionValue]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    (inputProps?.onFocus as (() => void) | undefined)?.();
  }, [inputProps]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setTouched(true);
    (inputProps?.onBlur as (() => void) | undefined)?.();
  }, [inputProps]);

  const defaultPlaceholders: Record<string, string> = {
    email: 'Enter your email address',
    tel: '(XXX) XXX-XXXX',
    password: isLoginPassword
      ? 'Enter your password'
      : isConfirmPassword
        ? 'Confirm your password'
        : 'Create a password',
  };
  const resolvedPlaceholder = placeholder ?? defaultPlaceholders[type] ?? undefined;
  const htmlType =
    type === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : type === 'tel'
        ? 'tel'
        : type === 'email'
          ? 'email'
          : undefined;
  const isMobileOrTablet = useMediaQuery('(max-width: 1023px)');
  const showPasswordValid = isNewPassword && (touched || isFocused) && value && validation.valid;
  const showConfirmMatch = isConfirmPassword && (touched || isFocused) && value && confirmValid;
  const showPasswordCriteriaTooltip =
    isNewPassword && !isMobileOrTablet && value.length > 0 && !validation.valid;
  const showPasswordInline = isNewPassword && isMobileOrTablet && value.length > 0 && !validation.valid;

  return (
    <InputFieldWrapper data-annotation-target="TextInputField" sx={sx} {...props}>
      {label && !hideLabel && (
        <InputLabelRow>
          <InputLabelText>{label}</InputLabelText>
          {required && <InputRequiredMark component="span">*</InputRequiredMark>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </InputLabelRow>
      )}

      <InputBox
        isError={isError}
        isFocused={isFocused}
        isDisabled={disabled}
        isSmall={isSmall}
        isGhost={isGhost}
        style={
          {
            paddingLeft: hasLeft ? inputPxIcon : inputPxBase,
            paddingRight: hasRight ? inputPxIcon : inputPxBase,
            paddingTop: inputPyToken,
            paddingBottom: inputPyToken,
          } as React.CSSProperties
        }
      >
        {startIcon && (
          <InputLeftIconWrapperWithGap hasRight={hasRight}>
            <InputIconSlot iconSize={iconSize}>{startIcon}</InputIconSlot>
          </InputLeftIconWrapperWithGap>
        )}

        <StyledInputBase
          value={value}
          onChange={handleChange}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          isSmall={isSmall}
          inputProps={{
            ...inputProps,
            readOnly,
            ...(htmlType ? { type: htmlType } : {}),
            ...(type === 'tel' ? { inputMode: 'tel' as const } : {}),
          }}
        />

        {hasRight && (
          <InputRightIconWrapperWithGap
            isSuccess={resolvedChecked && !endIcon && !passwordToggle}
            hasLeft={hasLeft}
          >
            <InputIconSlot iconSize={iconSize}>{effectiveEndIcon}</InputIconSlot>
          </InputRightIconWrapperWithGap>
        )}
      </InputBox>

      {suggestion && (
        <InputSuggestionRow
          isSmall={isSmall}
          role="checkbox"
          aria-checked={suggestionChecked}
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggleSuggestion}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleToggleSuggestion();
            }
          }}
        >
          <Checkbox checked={suggestionChecked} onChange={handleToggleSuggestion} />
          <span>
            <InputSuggestionLabelText isSmall={isSmall}>{suggestion.label}</InputSuggestionLabelText>
            {suggestion.mutedText && (
              <InputSuggestionMutedText isSmall={isSmall}>{suggestion.mutedText}</InputSuggestionMutedText>
            )}
          </span>
        </InputSuggestionRow>
      )}

      {isError && (
        <InputErrorRow>
          {showPasswordCriteriaTooltip && liveCriteria ? (
            <IconTooltip
              icon={<WarningOutlineIcon size={20} color={theme.semantic.error.main} />}
              open={showPasswordCriteriaTooltip && isFocused}
              placement="bottom"
              title={<PasswordCriteriaContent criteria={liveCriteria} />}
              size={20}
              color={theme.semantic.error.main}
            />
          ) : (
            resolvedErrorIcon
          )}
          <InputErrorText>{resolvedError}</InputErrorText>
        </InputErrorRow>
      )}

      {showPasswordValid && (
        <InputStatusRow>
          <CheckmarkIcon size={20} color={theme.semantic.success.main} />
          <InputStatusText>Password criteria are all met</InputStatusText>
        </InputStatusRow>
      )}

      {showConfirmMatch && (
        <InputStatusRow>
          <CheckmarkIcon size={20} color={theme.semantic.success.main} />
          <InputStatusText>Passwords match</InputStatusText>
        </InputStatusRow>
      )}

      {showPasswordInline && validation.criteria && (
        <InputCriteriaBox>
          {passwordRules.map((rule) => (
            <InputCriteriaRow key={rule.key}>
              {validation.criteria![rule.key] ? (
                <CheckmarkIcon size={20} color={theme.semantic.success.main} />
              ) : (
                <CloseIcon size={20} color={theme.semantic.error.main} />
              )}
              <InputCriteriaText>{rule.label}</InputCriteriaText>
            </InputCriteriaRow>
          ))}
        </InputCriteriaBox>
      )}
    </InputFieldWrapper>
  );
}
