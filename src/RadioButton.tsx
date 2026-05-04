'use client';

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { RadioControl, RadioDot, RadioLabel, RadioWrapper } from './RadioButton.styles';

export interface RadioButtonProps {
  selected?: boolean;
  onChange?: (selected: boolean) => void;
  label?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export default function RadioButton({
  selected = false,
  onChange,
  label,
  disabled = false,
  sx,
}: RadioButtonProps) {
  function handleClick() {
    if (!disabled) onChange?.(!selected);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <RadioWrapper
      component="span"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      isSelected={selected}
      hasLabel={Boolean(label)}
      isDisabled={disabled}
      sx={sx}
    >
      <RadioControl className="rb-control" isSelected={selected}>
        {selected && <RadioDot />}
      </RadioControl>
      {label && <RadioLabel>{label}</RadioLabel>}
    </RadioWrapper>
  );
}
