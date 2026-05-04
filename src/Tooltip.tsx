'use client';

import React from 'react';
import MuiTooltip, { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/material/styles';
import { getTooltipSlotStyles } from './Tooltip.styles';

export interface TooltipProps extends Omit<MuiTooltipProps, 'title'> {
  title: React.ReactNode;
  placement?: MuiTooltipProps['placement'];
  children: React.ReactElement;
}

export default function Tooltip({ title, placement = 'top', children, ...props }: TooltipProps) {
  const theme = useTheme();

  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 0 }}
      componentsProps={getTooltipSlotStyles(theme)}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
}
