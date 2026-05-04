'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const FooterRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.customSpacing[2],
  minHeight: 70,
  borderTop: '1px solid',
  borderColor: theme.semantic.divider,
  backgroundColor: theme.semantic.common.white,
  paddingLeft: theme.customSpacing[4],
  paddingRight: theme.customSpacing[4],
  paddingTop: theme.customSpacing[3],
  paddingBottom: theme.customSpacing[3],
  flexShrink: 0,
  flexWrap: 'wrap',
})) as typeof Box;

export const CopyrightText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
  textAlign: 'center',
})) as typeof Typography;

export const LinksRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

export const LinkItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
}));

export const DotSeparator = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.disabled,
})) as typeof Typography;

export const FooterLink = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.secondary,
  textDecoration: 'none',
  transition: 'color 0.15s',
  '&:hover': {
    color: theme.semantic.primary.main,
    textDecoration: 'underline',
  },
})) as typeof Typography;
