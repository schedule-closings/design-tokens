'use client';

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import Toggle, { ToggleSize, ToggleStyle } from './Toggle';
import { ToggleFieldLabelSpan, ToggleFieldLabelText, ToggleFieldRoot } from './ToggleField.styles';

export interface ToggleFieldProps {
  label?: string;
  hideLabel?: boolean;
  tooltip?: string;
  labelPosition?: 'left' | 'right';
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: ToggleSize;
  style?: ToggleStyle;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export default function ToggleField({
  label,
  hideLabel,
  tooltip,
  labelPosition = 'left',
  checked = false,
  onChange,
  size = 'sm',
  style = 'inner',
  disabled = false,
  sx,
}: ToggleFieldProps) {
  const labelNode = label && !hideLabel && (
    <ToggleFieldLabelSpan component="span">
      <ToggleFieldLabelText>{label}</ToggleFieldLabelText>
      {tooltip && <IconTooltip title={tooltip} size={18} />}
    </ToggleFieldLabelSpan>
  );

  return (
    <ToggleFieldRoot component="label" isDisabled={disabled} sx={sx}>
      {labelPosition === 'left' && labelNode}
      <Toggle checked={checked} onChange={onChange} size={size} style={style} disabled={disabled} />
      {labelPosition === 'right' && labelNode}
    </ToggleFieldRoot>
  );
}
