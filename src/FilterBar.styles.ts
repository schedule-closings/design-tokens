import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SmoothBox from './SmoothBox';

// ”€”€ Bar root ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€

export const FilterBarRoot = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  minWidth: 0,
}));

// Small numeric pill shown inside the trigger when at least one filter is
// applied. Doubles as the per-category count inside the popover rows.
export const FilterCountBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 18,
  height: 18,
  paddingLeft: theme.customSpacing[1],
  paddingRight: theme.customSpacing[1],
  borderRadius: 999,
  ...theme.customTypography.caption.medium,
  fontVariantNumeric: 'tabular-nums',
  backgroundColor: theme.semantic.primary.main,
  color: theme.semantic.primary.contrastText,
  flexShrink: 0,
}));

// ”€”€ Popover surface ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€

export const PopoverPaper = styled(SmoothBox)(({ theme }) => ({
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.high,
  border: `1px solid ${theme.semantic.divider}`,
  boxShadow: theme.customShadows.lg,
  paddingTop: theme.customSpacing[1],
  paddingBottom: theme.customSpacing[1],
  minWidth: 240,
  outline: 'none',
}));

export const PopoverHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

export const PopoverBackButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  '&:hover': { color: theme.semantic.text.primary },
}));

export const CategoryListRow = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  width: '100%',
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.primary,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  '&:hover': { backgroundColor: theme.semantic.action.hover },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: '-2px',
  },
}));

export const CategoryRowMeta = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  marginLeft: 'auto',
  ...theme.customTypography.caption.regular,
  color: theme.semantic.text.secondary,
}));

export const PopoverFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: `1px solid ${theme.semantic.divider}`,
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  marginTop: theme.customSpacing[1],
}));

export const PopoverFooterAction = styled('button')(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  '&:hover': { color: theme.semantic.primary.main },
}));
