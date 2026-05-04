'use client';

/**
 * ContentPanel --- Split header/body/actions layout for main content areas.
 * Source: Figma file HrCvQ5lSiKunZAzUcxdKFC, nodes 31536-80760 & 31541-80971
 *
 * Renders a card with up to three rows:
 *   1. Header row (optional) --- tabs, filters, step progress, breadcrumbs
 *   2. Body row --- main scrollable content area
 *   3. Actions row (optional) --- sticky bottom bar for Cancel/Previous/Next/Submit
 *
 * When `header` is omitted, body gets top rounded corners.
 * When `actions` is omitted, body gets bottom rounded corners.
 *
 * Use INSIDE AppShell with `contentSx={{ p: 0, bgcolor: 'transparent', boxShadow: 'none', border: 'none' }}`
 * so the ContentPanel provides its own card styling.
 *
 * Props:
 *   header    --- ReactNode  --- content for the top header row
 *   children  --- ReactNode  --- content for the body area
 *   actions   --- ReactNode  --- content for the sticky bottom actions row
 *   headerSx  --- SxProps    --- overrides on the header section
 *   bodySx    --- SxProps    --- overrides on the body section
 *   actionsSx --- SxProps    --- overrides on the actions section
 *   sx        --- SxProps    --- overrides on the outer wrapper
 */

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { PanelRoot, PanelHeader, PanelBody, PanelActions } from './ContentPanel.styles';

export interface ContentPanelProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  headerSx?: SxProps<Theme>;
  bodySx?: SxProps<Theme>;
  actionsSx?: SxProps<Theme>;
  sx?: SxProps<Theme>;
}

export default function ContentPanel({
  header,
  children,
  actions,
  headerSx,
  bodySx,
  actionsSx,
  sx,
}: ContentPanelProps) {
  const hasHeader = header != null;
  const hasActions = actions != null;

  return (
    <PanelRoot sx={sx}>
      {/* ------ Header row ------ */}
      {hasHeader && (
        <PanelHeader sx={headerSx}>
          {header}
        </PanelHeader>
      )}

      {/* ------ Body row ------ */}
      <PanelBody sx={bodySx}>
        {children}
      </PanelBody>

      {/* ------ Actions row (sticky bottom) ------ */}
      {hasActions && (
        <PanelActions sx={actionsSx}>
          {actions}
        </PanelActions>
      )}
    </PanelRoot>
  );
}
