'use client';

import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Checkbox from './Checkbox';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import {
  AccordionRoot,
  AccordionHeader,
  AccordionCheckboxSpan,
  AccordionLabel,
  AccordionDivider,
  AccordionBody,
} from './Accordion.styles';

export interface AccordionProps {
  label?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
  checkbox?: boolean;
  checked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  sx?: SxProps<Theme>;
}

export default function Accordion({
  label = 'Accordion Header',
  children,
  defaultExpanded = false,
  expanded: expandedProp,
  onChange,
  checkbox = false,
  checked = false,
  onCheckboxChange,
  sx,
}: AccordionProps) {
  const theme = useTheme();
  const isControlled = expandedProp !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = isControlled ? expandedProp : internalExpanded;

  const handleToggle = () => {
    const next = !isExpanded;
    if (!isControlled) setInternalExpanded(next);
    onChange?.(next);
  };

  return (
    <AccordionRoot sx={sx}>
      <AccordionHeader
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={handleToggle}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {checkbox && (
          <AccordionCheckboxSpan
            component="span"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
          >
            <Checkbox checked={checked} onChange={onCheckboxChange} />
          </AccordionCheckboxSpan>
        )}

        <AccordionLabel>{label}</AccordionLabel>

        {isExpanded ? (
          <ChevronUpIcon size={24} color={theme.semantic.text.primary} />
        ) : (
          <ChevronDownIcon size={24} color={theme.semantic.text.primary} />
        )}
      </AccordionHeader>

      <Collapse in={isExpanded} unmountOnExit>
        <AccordionDivider />
        <AccordionBody>{children}</AccordionBody>
      </Collapse>
    </AccordionRoot>
  );
}
