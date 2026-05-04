'use client';

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { CheckboxWrapper, CheckboxControl, CheckboxLabel } from './Checkbox.styles';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  indeterminate?: boolean;
  sx?: SxProps<Theme>;
}

function CheckmarkSvg() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
      <path
        d="M1 4L3.5 6.5L9 1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  sx,
}: CheckboxProps) {
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
    <CheckboxWrapper
      component="span"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      isChecked={checked}
      hasLabel={Boolean(label)}
      isDisabled={disabled}
      sx={sx}
    >
      <CheckboxControl className="cb-control" isChecked={checked}>
        {checked && <CheckmarkSvg />}
      </CheckboxControl>
      {label && <CheckboxLabel>{label}</CheckboxLabel>}
    </CheckboxWrapper>
  );
}
