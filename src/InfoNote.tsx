'use client';

/**
 * InfoNote --- SV Design System
 * Source: Figma file iRAMCNMRIgynOcF4RYVxRz, node 343-1847
 *
 * A tinted informational banner with four semantic types (info, success, error, warning).
 * Supports optional collapse/expand and dismiss behaviour.
 *
 * Props:
 *   type             --- 'info'|'success'|'error'|'warning' --- semantic variant; default 'info'
 *   title            --- string           --- bold synopsis; always shown (collapsed and expanded)
 *   description      --- string           --- muted body text shown below title when expanded
 *   icon             --- React.FC<IconProps> --- overrides the default type icon (e.g. LocationOutlineIcon)
 *   size             --- 'default'|'small' --- 'small' switches the body text to body2 typography (title stays body1); default 'default'
 *   collapsible      --- bool             --- enable Show more / Show less toggle; default false
 *   defaultExpanded  --- bool             --- initial expanded state (uncontrolled); default true
 *   expanded         --- bool             --- controlled expanded state; pair with onExpandChange
 *   onExpandChange   --- func             --- (expanded: boolean) => void
 *   dismissable      --- bool             --- shows "Don't show again" link; default false
 *   onDismiss        --- func             --- () => void --- called when "Don't show again" is clicked
 *   actions          --- InfoNoteAction[] --- additional action links rendered before "Don't show again"
 */

import React, { useState, useMemo } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import SmoothBox from './SmoothBox';
import {
  InfoOutlineIcon,
  CheckmarkOutlineIcon,
  WarningOutlineIcon,
  AlertOutlineIcon,
} from './icons';
import { IconProps } from './icons';
import {
  InfoNoteLayout,
  InfoNoteContentRow,
  InfoNoteIconBox,
  InfoNoteTextCol,
  InfoNoteTitle,
  InfoNoteBody,
  InfoNoteActionsRow,
  InfoNoteActionLink,
} from './InfoNote.styles';

// --------- Type config ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

interface InfoNoteTypeConfig {
  bg: string;
  darkBg: string;
  /** Light-mode color for icon and title (950 shade --- high contrast on tinted bg) */
  accentColor: string;
  /** Dark-mode color for icon and title (300 shade --- readable on dark tinted bg) */
  darkAccentColor: string;
  actionColor: string;
  darkActionColor: string;
  Icon: React.FC<IconProps>;
}

function getTypeConfig(theme: Theme): Record<InfoNoteType, InfoNoteTypeConfig> {
  return {
    info: {
      bg: theme.colors.blue[50],
      darkBg: `color-mix(in srgb, ${theme.colors.blue[500]} 10%, ${theme.colors.slate[900]})`,
      accentColor: theme.colors.blue[950],
      darkAccentColor: theme.colors.blue[300],
      actionColor: theme.semantic.primary.dark,
      darkActionColor: theme.colors.blue[300],
      Icon: InfoOutlineIcon,
    },
    success: {
      bg: theme.colors.green[50],
      darkBg: `color-mix(in srgb, ${theme.colors.green[500]} 10%, ${theme.colors.slate[900]})`,
      accentColor: theme.colors.green[950],
      darkAccentColor: theme.colors.green[300],
      actionColor: theme.semantic.success.dark,
      darkActionColor: theme.colors.green[300],
      Icon: CheckmarkOutlineIcon,
    },
    error: {
      bg: theme.colors.red[50],
      darkBg: `color-mix(in srgb, ${theme.colors.red[500]} 10%, ${theme.colors.slate[900]})`,
      accentColor: theme.colors.red[950],
      darkAccentColor: theme.colors.red[300],
      actionColor: theme.semantic.error.dark,
      darkActionColor: theme.colors.red[300],
      Icon: WarningOutlineIcon,
    },
    warning: {
      bg: theme.colors.yellow[50],
      darkBg: `color-mix(in srgb, ${theme.colors.yellow[500]} 10%, ${theme.colors.slate[900]})`,
      accentColor: theme.colors.yellow[950],
      darkAccentColor: theme.colors.yellow[300],
      actionColor: theme.semantic.alert.dark,
      darkActionColor: theme.colors.yellow[300],
      Icon: AlertOutlineIcon,
    },
  };
}

// --------- Types ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export type InfoNoteType = 'info' | 'success' | 'error' | 'warning';

export type InfoNoteAction = {
  label: string;
  onClick: () => void;
  /** 'error' forces red. Omit or 'primary' uses the note type's accent color. */
  color?: 'primary' | 'error';
};

export interface InfoNoteProps {
  type?: InfoNoteType;
  title?: string;
  description?: React.ReactNode;
  /** Override the default type icon (e.g. LocationOutlineIcon). */
  icon?: React.FC<IconProps>;
  /** 'small' downshifts the body text to body2 typography (title stays body1). Defaults to 'default'. */
  size?: 'default' | 'small';
  collapsible?: boolean;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  dismissable?: boolean;
  onDismiss?: () => void;
  actions?: InfoNoteAction[];
}

// --------- Component ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default function InfoNote({
  type = 'info',
  title,
  description,
  icon,
  size = 'default',
  collapsible = false,
  defaultExpanded = true,
  expanded: expandedProp,
  onExpandChange,
  dismissable = false,
  onDismiss,
  actions = [],
}: InfoNoteProps) {
  const theme = useTheme();
  const TYPE_CONFIG = getTypeConfig(theme);
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
  const Icon = icon ?? cfg.Icon;

  const isControlled = expandedProp !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = collapsible ? (isControlled ? expandedProp! : internalExpanded) : true;

  const handleToggle = () => {
    const next = !isExpanded;
    if (!isControlled) setInternalExpanded(next);
    onExpandChange?.(next);
  };

  const isCollapsed = collapsible && !isExpanded;
  const hasActionsRow =
    isCollapsed ||
    dismissable ||
    (collapsible && isExpanded) ||
    actions.length > 0;

  const containerSx = useMemo(() => ({
    backgroundColor: cfg.bg,
    '[data-color-mode="dark"] &': { backgroundColor: cfg.darkBg },
  }), [cfg.bg, cfg.darkBg]);

  return (
    <SmoothBox smoothRadius={theme.customBorderRadius.xl} sx={containerSx}>
      <InfoNoteLayout $collapsed={isCollapsed}>
        {/* ------ Content row: icon + title (+ description when expanded) ------ */}
        <InfoNoteContentRow $collapsed={isCollapsed}>
          <InfoNoteIconBox $color={cfg.accentColor} $darkColor={cfg.darkAccentColor}>
            <Icon size={24} color="currentColor" />
          </InfoNoteIconBox>
          <InfoNoteTextCol>
            {title && (
              <InfoNoteTitle $color={cfg.accentColor} $darkColor={cfg.darkAccentColor}>
                {title}
              </InfoNoteTitle>
            )}
            {!isCollapsed && description && (
              <InfoNoteBody $color={cfg.accentColor} $darkColor={cfg.darkAccentColor} $size={size}>
                {description}
              </InfoNoteBody>
            )}
          </InfoNoteTextCol>
        </InfoNoteContentRow>

        {/* ------ Actions row: custom actions, dismiss, show more/less ------ */}
        {hasActionsRow && (
          <InfoNoteActionsRow>
            {/* Custom action links --- only visible when expanded */}
            {!isCollapsed &&
              actions.map((action, i) => (
                <InfoNoteActionLink
                  key={i}
                  $color={action.color}
                  $defaultColor={cfg.actionColor}
                  $darkDefaultColor={cfg.darkActionColor}
                  type="button"
                  onClick={action.onClick}
                >
                  {action.label}
                </InfoNoteActionLink>
              ))}

            {/* Don't show again --- only visible when expanded */}
            {!isCollapsed && dismissable && (
              <InfoNoteActionLink
                type="button"
                $defaultColor={cfg.actionColor}
                $darkDefaultColor={cfg.darkActionColor}
                onClick={onDismiss}
              >
                Don't show again
              </InfoNoteActionLink>
            )}

            {/* Expand/collapse toggle */}
            {collapsible && (
              <InfoNoteActionLink
                type="button"
                $defaultColor={cfg.actionColor}
                $darkDefaultColor={cfg.darkActionColor}
                aria-expanded={isExpanded}
                onClick={handleToggle}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </InfoNoteActionLink>
            )}
          </InfoNoteActionsRow>
        )}
      </InfoNoteLayout>
    </SmoothBox>
  );
}
