import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const POPOVER_WIDTH = 320;

export const PopoverCard = styled(Box, {
  shouldForwardProp: (p) => p !== 'shaking' && p !== 'measured',
})<{ shaking?: boolean; measured?: boolean }>(({ theme, shaking, measured }) => ({
  position: 'fixed',
  zIndex: 1400,
  width: POPOVER_WIDTH,
  backgroundColor: theme.semantic.common.white,
  borderRadius: theme.customBorderRadius.xl,
  boxShadow: shaking
    ? [
        theme.customShadows.lg,
        `0 0 0 4px ${theme.colors.blue[500]}`,
        `0 0 24px 6px color-mix(in srgb, ${theme.colors.blue[500]} 70%, transparent)`,
        `0 0 48px 14px color-mix(in srgb, ${theme.colors.blue[400]} 35%, transparent)`,
        `0 0 80px 20px color-mix(in srgb, ${theme.colors.blue[300]} 12%, transparent)`,
      ].join(', ')
    : theme.customShadows.lg,
  transition: 'box-shadow 0.5s ease-out, opacity 0.22s ease-out, transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
  padding: theme.customSpacing[5],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
  opacity: measured ? 1 : 0,
  transform: measured ? 'scale(1)' : 'scale(0.85)',
  animation: shaking ? 'wt-shake 0.5s ease-in-out' : undefined,
}));

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.customSpacing[2],
}));

export const StepBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 22,
  minWidth: 34,
  paddingInline: theme.customSpacing[2],
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: theme.colors.blue[100],
  color: theme.semantic.primary.dark,
  '[data-color-mode="dark"] &': {
    backgroundColor: `color-mix(in srgb, ${theme.semantic.primary.main} 12%, transparent)`,
    color: theme.semantic.primary.dark,
  },
  ...theme.customTypography.caption.semibold,
}));

export const CloseButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  width: 28,
  height: 28,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.customBorderRadius.default,
  color: theme.semantic.text.secondary,
  '&:hover': { backgroundColor: theme.semantic.action.hover },
  '&:focus-visible': {
    outline: `2px solid ${theme.semantic.primary.main}`,
    outlineOffset: 2,
  },
}));

export const Title = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.semibold,
  color: theme.semantic.text.primary,
}));

export const Description = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
}));

export const HintRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  color: theme.semantic.primary.main,
  ...theme.customTypography.caption.semibold,
}));

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  justifyContent: 'flex-end',
  gap: theme.customSpacing[3],
  '& > button, & > a': {
    width: '100%',
  },
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.customSpacing[4],
    '& > button, & > a': {
      width: 'auto',
    },
  },
}));

export const CARET_SIZE = 12;

export const Caret = styled(Box, {
  shouldForwardProp: (p) => p !== 'side',
})<{ side: 'top' | 'bottom' | 'left' | 'right' }>(({ theme, side }) => ({
  position: 'absolute',
  width: CARET_SIZE,
  height: CARET_SIZE,
  backgroundColor: theme.semantic.common.white,
  transform: 'rotate(45deg)',
  ...(side === 'top'
    ? { top: -CARET_SIZE / 2 }
    : side === 'bottom'
      ? { bottom: -CARET_SIZE / 2 }
      : side === 'left'
        ? { left: -CARET_SIZE / 2 }
        : { right: -CARET_SIZE / 2 }),
}));

export const Overlay = styled('div')({
  position: 'fixed',
  inset: 0,
  zIndex: 1300,
  pointerEvents: 'auto',
  animation: 'wt-fade-in 0.22s ease-out',
});

export const OutlineRing = styled('div')({
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 1300,
  animation: 'wt-fade-in 0.22s ease-out, wt-pulse 1.8s ease-in-out infinite',
});

export const CaptureTarget = styled('div')({
  position: 'fixed',
  zIndex: 1350,
  background: 'transparent',
  animation: 'wt-fade-in 0.22s ease-out',
});
