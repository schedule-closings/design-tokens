// app/components/StatePill.styles.ts
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Base pill shape --- shared between StatePill (component) and any ad-hoc
// consumer that wants to render a matching pill (e.g. the "+N" overflow
// count in a state-chip row).
//
// Visual spec mirrors DataTable's PillChip (light slate/gray bg + subtle
// border) so state pills sit comfortably inside tables without drawing
// extra attention.
export const StatePillRoot = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  backgroundColor: theme.colors.gray[50],
  border: `1px solid ${theme.colors.slate[300]}`,
  borderRadius: theme.customBorderRadius.lg,
  paddingInline: theme.customSpacing[2],
  paddingBlock: theme.customSpacing[1],
  color: theme.semantic.text.primary,
  // Match PillChip + MoreDataBadge (both body1 @ 16px) so heights line up
  // when state pills and overflow "+N" badges sit next to each other in a
  // single row.
  ...theme.customTypography.body1.regular,
  whiteSpace: 'nowrap',
  '[data-color-mode="dark"] &': {
    backgroundColor: `color-mix(in srgb, ${theme.colors.slate[500]} 12%, transparent)`,
    borderColor: theme.semantic.divider,
  },
}));

// Secondary-color span used inside the "name-with-code" variant to dim
// the parenthetical code --- "New York <muted>(NY)</muted>".
export const StatePillCodeMuted = styled('span')(({ theme }) => ({
  color: theme.semantic.text.secondary,
}));

// Styling for the "+N" overflow pill. Matches MoreDataBadge in DataTable
// (used by OfficePill / NamePill overflow badges) so the visual is
// consistent across the app: blue/50 background, primary.light border,
// primary.dark text in body1.medium --- distinct enough from regular state
// pills that the overflow reads as "there's more here, click/hover me".
export const StatePillOverflowRoot = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: `1px solid ${theme.semantic.primary.light}`,
  backgroundColor: theme.colors.blue[50],
  borderRadius: theme.customBorderRadius.lg,
  paddingInline: theme.customSpacing[2],
  paddingBlock: theme.customSpacing[1],
  color: theme.semantic.primary.dark,
  ...theme.customTypography.body1.medium,
  whiteSpace: 'nowrap',
  cursor: 'default',
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: theme.colors.blue[100] },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '2px',
  },
  '[data-color-mode="dark"] &': {
    backgroundColor: `color-mix(in srgb, ${theme.colors.blue[500]} 12%, transparent)`,
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.blue[500]} 20%, transparent)`,
    },
  },
}));
