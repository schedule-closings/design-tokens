'use client';

import React, { useState } from 'react';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import { WarningOutlineIcon } from './icons';
import {
  TextareaBox,
  TextareaErrorRow,
  TextareaErrorText,
  TextareaInput,
  TextareaLabelRow,
  TextareaLabelText,
  TextareaRequiredMark,
  TextareaWrapper,
} from './TextareaField.styles';

export interface TextareaFieldProps {
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: string;
  errorIcon?: React.ReactNode;
  tooltip?: string;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  required?: boolean;
  disabled?: boolean;
  size?: 'base' | 'small';
  sx?: SxProps<Theme>;
  inputProps?: Record<string, unknown>;
  [key: string]: unknown;
}

export default function TextareaField({
  label,
  hideLabel,
  placeholder,
  value,
  onChange,
  error,
  errorIcon,
  tooltip,
  rows,
  minRows = 3,
  maxRows,
  required = false,
  disabled = false,
  size = 'base',
  sx,
  inputProps,
  ...props
}: TextareaFieldProps) {
  const theme = useTheme();
  const isSmall = size === 'small';
  const [isFocused, setIsFocused] = useState(false);
  const isError = Boolean(error && !disabled);
  const resolvedErrorIcon = errorIcon ?? (
    <WarningOutlineIcon size={20} color={theme.semantic.error.main} />
  );
  const rowProps = rows != null ? { rows } : { minRows, ...(maxRows != null && { maxRows }) };

  return (
    <TextareaWrapper data-annotation-target="TextareaField" sx={sx} {...props}>
      {label && !hideLabel && (
        <TextareaLabelRow>
          <TextareaLabelText>{label}</TextareaLabelText>
          {required && <TextareaRequiredMark component="span">*</TextareaRequiredMark>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </TextareaLabelRow>
      )}

      <TextareaBox isError={isError} isFocused={isFocused} isDisabled={disabled} isSmall={isSmall}>
        <TextareaInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          multiline
          fullWidth
          isSmall={isSmall}
          {...rowProps}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          inputProps={{ ...inputProps }}
        />
      </TextareaBox>

      {isError && (
        <TextareaErrorRow>
          {resolvedErrorIcon}
          <TextareaErrorText>{error}</TextareaErrorText>
        </TextareaErrorRow>
      )}
    </TextareaWrapper>
  );
}
