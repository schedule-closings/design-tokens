'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// ---------------------------------------------------------------------------
// Styled: TruncatedTypography - single-line text with CSS ellipsis truncation.
// ---------------------------------------------------------------------------
export const TruncatedTypography = styled(Typography)<{
  component?: React.ElementType;
}>(() => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
}));
