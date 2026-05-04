'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const StepperRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  gap: theme.customSpacing[3],
}));

export const SegmentRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  gap: theme.customSpacing[2],
}));

export const Segment = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFilled',
})<{ isFilled?: boolean }>(({ theme, isFilled }) => ({
  flex: 1,
  height: 6,
  borderRadius: theme.customBorderRadius.full,
  backgroundColor: isFilled ? theme.semantic.primary.main : theme.semantic.divider,
  transition: 'background-color 200ms ease',
}));

export const ActiveLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.medium,
  color: theme.semantic.primary.main,
  textAlign: 'center',
  width: '100%',
}));
