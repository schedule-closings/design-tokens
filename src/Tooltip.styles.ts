import type { Theme } from '@mui/material/styles';

export const getTooltipSlotStyles = (theme: Theme) => ({
  tooltip: {
    sx: {
      ...theme.customTypography.body1.regular,
      backgroundColor: theme.semantic.common.black,
      color: theme.semantic.common.white,
      borderRadius: theme.customBorderRadius.xl,
      padding: theme.customSpacing[4],
      maxWidth: theme.customSpacing[80],
      boxShadow: 'none',
    },
  },
  arrow: {
    sx: {
      color: theme.semantic.common.black,
      '&::before': {
        border: 'none',
        backgroundColor: theme.semantic.common.black,
      },
    },
  },
});
