'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/* -------------------------------------------------------------------------------
   DataTable styled components
   ------------------------------------------------------------------------------- */

//  ColumnVisibilityMenu trigger 

const COL_VIS_TRIGGER_PROPS = ['isOpen'] as const;

export const ColVisTriggerButton = styled(Box, {
  shouldForwardProp: (prop) => !(COL_VIS_TRIGGER_PROPS as readonly string[]).includes(prop as string),
})<{ isOpen?: boolean } & { component?: React.ElementType }>(({ theme, isOpen }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.customSpacing[1],
  height: theme.inputHeights.base,
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  backgroundColor: 'transparent',
  color: theme.semantic.text.primary,
  border: `1px solid ${isOpen ? theme.semantic.text.primary : theme.semantic.action.disabled}`,
  borderRadius: theme.customBorderRadius.xl,
  boxShadow: isOpen ? theme.customShadows.focusPrimary : 'none',
  fontSize: '16px',
  lineHeight: 1,
  fontWeight: 400,
  ...(theme.textTrim as Record<string, string>),
  letterSpacing: '0',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
  '&:hover': { backgroundColor: theme.semantic.action.hover },
}));

//  ActionIconButton 

export const ActionIconButtonRoot = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  borderRadius: theme.customBorderRadius.default,
  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.semantic.primary.focusVisible}`,
  },
}));

//  Main DataTable wrapper 

export const DataTableRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
}));

//  Toolbar 

export const Toolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[3],
  flexWrap: 'wrap',
}));

export const ToolbarSpacer = styled(Box)({
  flex: 1,
});

//  Scroll container 

export const ScrollContainerOuter = styled(Box)(({ theme }) => ({
  position: 'relative',
  // Use `clip` + `overflowClipMargin` so the table's rounded border still
  // clips inner content, but focus rings on edge-column controls can spill
  // a few pixels past the frame without being shaved off.
  overflow: 'clip',
  overflowClipMargin: '8px',
  border: `1px solid ${theme.semantic.divider}`,
  borderRadius: theme.customBorderRadius.lg,
}));

const SCROLL_SHADOW_PROPS = ['side'] as const;

export const ScrollShadow = styled(Box, {
  shouldForwardProp: (prop) => !(SCROLL_SHADOW_PROPS as readonly string[]).includes(prop as string),
})<{ side: 'left' | 'right' }>(({ side }) => ({
  position: 'absolute',
  [side]: 0,
  top: 0,
  bottom: 0,
  width: 32,
  zIndex: 3,
  pointerEvents: 'none',
  background: side === 'left'
    ? 'linear-gradient(to right, rgba(0,0,0,0.07), transparent)'
    : 'linear-gradient(to left, rgba(0,0,0,0.07), transparent)',
}));

export const ScrollContainerInner = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  overflowY: 'visible',
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.colors.slate[300]} transparent`,
  '&::-webkit-scrollbar': { height: 6, width: 6 },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    background: theme.colors.slate[300],
    borderRadius: theme.customBorderRadius.full,
    '&:hover': { background: theme.colors.slate[400] },
  },
  // Elevate the focused body cell above its neighbors so in-cell control
  // focus halos / open-state box-shadows paint over adjacent cell
  // backgrounds instead of being covered by them. Every <td> has its own
  // backgroundColor which would otherwise clip the halo at the cell border.
  // Scoped to cells that don't already set inline `position` (sticky cells
  // opt out  they already manage their own stacking).
  '& tbody tr > td': {
    position: 'relative',
  },
  '& tbody tr > td:focus-within': {
    zIndex: 2,
  },
}));

//  Empty state (shared between no-columns-visible and no-results) 

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.customSpacing[3],
  paddingTop: theme.customSpacing[10],
  paddingBottom: theme.customSpacing[10],
  paddingLeft: theme.customSpacing[4],
  paddingRight: theme.customSpacing[4],
  backgroundColor: 'var(--sc-dt-empty-bg)',
}));

export const EmptyStateIconCircle = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: 'var(--sc-dt-empty-icon-bg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const EmptyStateTitle = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.bold,
  color: theme.semantic.text.primary,
}));

export const EmptyStateDescription = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
  textAlign: 'center',
}));

export const EmptyStateActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.customSpacing[3],
  alignItems: 'center',
}));

//  Header cell inner layout 

export const HeaderCellInner = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  position: 'relative',
});

export const SortableHeaderButton = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flex: 1,
  minWidth: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    borderRadius: theme.customBorderRadius.sm,
    outlineOffset: '2px',
  },
}));

//  Loading skeleton 

export const SkeletonCheckboxBox = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  borderRadius: theme.customBorderRadius.sm,
  backgroundColor: theme.semantic.action.hover,
}));

const SKELETON_BAR_PROPS = ['barWidth'] as const;

export const SkeletonBar = styled(Box, {
  shouldForwardProp: (prop) => !(SKELETON_BAR_PROPS as readonly string[]).includes(prop as string),
})<{ barWidth?: string }>(({ theme, barWidth }) => ({
  height: 14,
  borderRadius: '4px',
  backgroundColor: theme.semantic.action.hover,
  width: barWidth ?? '70%',
}));

export const SkeletonBarAnimated = styled(Box, {
  shouldForwardProp: (prop) => !(SKELETON_BAR_PROPS as readonly string[]).includes(prop as string),
})<{ barWidth?: string }>(({ theme, barWidth }) => ({
  height: 14,
  borderRadius: '4px',
  backgroundColor: theme.semantic.action.hover,
  width: barWidth ?? '70%',
  '@keyframes pulse': {
    '0%,100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  animation: 'pulse 1.5s ease-in-out infinite',
}));

//  Footer / Pagination 

export const FooterBar = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '8px',
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '12px',
  paddingBottom: '12px',
});

export const FooterRangeText = styled(Box)(({ theme }) => ({
  fontSize: 14,
  color: theme.semantic.text.secondary,
  fontFamily: theme.fontFamilies.body,
}));

export const PaginationNav = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const RowsPerPageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: 14,
  color: theme.semantic.text.secondary,
  fontFamily: theme.fontFamilies.body,
}));

//  StatusBadge 

const STATUS_BADGE_PROPS = ['bgColor', 'textColor', 'darkBgColor', 'darkTextColor'] as const;

export const StatusBadgeRoot = styled(Box, {
  shouldForwardProp: (prop) => !(STATUS_BADGE_PROPS as readonly string[]).includes(prop as string),
})<{ bgColor: string; textColor: string; darkBgColor: string; darkTextColor: string } & { component?: React.ElementType }>(
  ({ theme, bgColor, textColor, darkBgColor, darkTextColor }) => ({
    backgroundColor: bgColor,
    color: textColor,
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    fontFamily: theme.fontFamilies.body,
    padding: '2px 10px',
    borderRadius: theme.customBorderRadius.full,
    display: 'inline-block',
    whiteSpace: 'nowrap',
    lineHeight: '20px',
    '[data-color-mode="dark"] &': {
      backgroundColor: darkBgColor,
      color: darkTextColor,
    },
  })
);

//  DocStatusIcon 

export const DocStatusIconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

//  PillChip (shared by NamePill and OfficePill) 

export const PillChip = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  maxWidth: '100%',
  minWidth: 0,
  border: `1px solid ${theme.colors.slate[300]}`,
  backgroundColor: theme.colors.gray[50],
  borderRadius: theme.customBorderRadius.lg,
  paddingLeft: theme.customSpacing[2],
  paddingRight: theme.customSpacing[2],
  paddingTop: theme.customSpacing[1],
  paddingBottom: theme.customSpacing[1],
  cursor: 'default',
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: theme.colors.gray[100] },
  '&:focus-visible': { outline: `2px solid ${theme.semantic.primary.main}`, outlineOffset: '2px' },
  '[data-color-mode="dark"] &': {
    backgroundColor: `color-mix(in srgb, ${theme.colors.slate[500]} 12%, transparent)`,
    borderColor: theme.semantic.divider,
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.slate[500]} 20%, transparent)`,
    },
  },
}));

//  NamePill not-registered dot 

export const NotRegisteredDot = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: theme.semantic.text.secondary,
  flexShrink: 0,
}));

//  InlineAddRow (consumer-supplied <td> cells for transient add form) 

export const InlineAddRow = styled('tr')(({ theme }) => ({
  backgroundColor: theme.colors.blue[50],
  '& > td': {
    padding: theme.customSpacing[3],
    borderBottom: `1px solid ${theme.semantic.divider}`,
    verticalAlign: 'middle',
  },
  // Pin the trailing actions td to the right edge so the Save/Cancel
  // icons stay visible when the table overflows horizontally  mirrors
  // the sticky Actions column in the table header/body. The explicit
  // background matches the draft-row tint so data in the colSpan'd td
  // to its left doesn't bleed through on scroll.
  '& > td:last-child': {
    position: 'sticky',
    right: 0,
    zIndex: 2,
    backgroundColor: theme.colors.blue[50],
  },
  // Match the sticky-Actions inset shadow when the scroll container
  // reports right-side overflow. The parent ScrollContainerInner carries
  // `data-has-right-overflow="true"` in that state  driving the shadow
  // via CSS here keeps InlineAddRow a pure styled component (no need
  // to plumb hasRight through as a prop).
  '[data-has-right-overflow="true"] & > td:last-child': {
    boxShadow: '-6px 0 12px var(--sc-dt-sticky-shadow)',
  },
}));

//  AddRowFooter (Add link row between table body and pagination) 
// Used by the default 'footer' inline-add variant  rendered OUTSIDE the
// table so it sits on its own row in the card's visual stack.
export const AddRowFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: `${theme.customSpacing[3]} ${theme.customSpacing[4]}`,
  borderTop: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.common.white,
}));

//  InlineAddTriggerRow 
// Used by the 'inline' inline-add variant  an "Add +" trigger rendered as
// a <tr> INSIDE <tbody>, after all data and pending-draft rows. Consumer
// provides a single <td colSpan={total}> child containing the button.
//
// No borderTop: the previous data row already paints a borderBottom via the
// per-td style on data rows; adding a borderTop here would stack the two
// into a visibly doubled (2px) divider.
export const InlineAddTriggerRow = styled('tr')(({ theme }) => ({
  backgroundColor: theme.semantic.common.white,
  '& > td': {
    padding: `${theme.customSpacing[3]} ${theme.customSpacing[4]}`,
    textAlign: 'right',
  },
}));

// Sticky wrapper for the inline-add trigger button. When the table
// overflows horizontally the colSpan'd td stretches beyond the viewport,
// so the trigger would render off-screen at the right edge. Wrapping the
// button in `position: sticky; right: spacing[4]` keeps it visually
// pinned to the right of the scroll container  matching the sticky
// Actions column's behavior  while still honoring the td's right-align.
export const InlineAddStickyWrap = styled('div')(({ theme }) => ({
  position: 'sticky',
  right: theme.customSpacing[4],
  display: 'inline-flex',
}));

//  MoreDataIndicator badge 

export const MoreDataBadge = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: `1px solid ${theme.semantic.primary.light}`,
  backgroundColor: theme.colors.blue[50],
  borderRadius: theme.customBorderRadius.lg,
  paddingLeft: theme.customSpacing[2],
  paddingRight: theme.customSpacing[2],
  paddingTop: theme.customSpacing[1],
  paddingBottom: theme.customSpacing[1],
  cursor: 'default',
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: theme.colors.blue[100] },
  '&:focus-visible': { outline: `2px solid ${theme.semantic.primary.main}`, outlineOffset: '2px' },
  '[data-color-mode="dark"] &': {
    backgroundColor: `color-mix(in srgb, ${theme.colors.blue[500]} 12%, transparent)`,
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.blue[500]} 20%, transparent)`,
    },
  },
}));
