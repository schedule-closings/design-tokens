'use client';

import React, { cloneElement, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Tooltip, { TooltipProps } from './Tooltip';
import { IconProps, InfoOutlineIcon } from './icons';

export interface IconTooltipProps {
  title?: React.ReactNode;
  icon?: React.ReactElement;
  placement?: TooltipProps['placement'];
  size?: number;
  color?: string;
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function IconTooltip({
  title,
  icon,
  placement = 'top',
  size = 20,
  color: colorProp,
  tooltipProps = {},
  open: controlledOpen,
  onOpenChange,
}: IconTooltipProps) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const color = colorProp ?? theme.semantic.text.secondary;
  const resolvedColor =
    (isHovered || controlledOpen) && !colorProp ? theme.semantic.text.primary : color;

  const iconNode = icon ? (
    cloneElement(icon as React.ReactElement<IconProps>, { size, color: resolvedColor })
  ) : (
    <InfoOutlineIcon size={size} color={resolvedColor} />
  );

  const container = (
    <Box
      component="span"
      {...(title
        ? { role: 'img', 'aria-label': typeof title === 'string' ? title : 'info' }
        : { 'aria-hidden': true })}
      onMouseEnter={() => {
        setIsHovered(true);
        onOpenChange?.(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onOpenChange?.(false);
      }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        cursor: 'default',
        transition: 'color 0.15s',
      }}
    >
      {iconNode}
    </Box>
  );

  if (!title) return container;

  const isOpen = controlledOpen !== undefined ? controlledOpen || isHovered : undefined;

  return (
    <Tooltip
      title={title}
      placement={placement}
      {...(isOpen !== undefined ? { open: isOpen } : {})}
      {...tooltipProps}
    >
      {container}
    </Tooltip>
  );
}
