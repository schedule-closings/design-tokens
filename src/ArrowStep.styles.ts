'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const ArrowContentBox = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
});

export const ArrowLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const ArrowDescText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  opacity: 0.75,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));
