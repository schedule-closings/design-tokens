'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const ModalCloseButton = styled('button')(({ theme }) => ({
  position: 'absolute',
  top: theme.customSpacing[4],
  right: theme.customSpacing[4],
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  zIndex: 1,
  '&:hover': { opacity: 0.7 },
}));

export const ModalTitleText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.h6.bold,
  color: theme.semantic.text.primary,
  textAlign: 'center',
  '@media (min-width: 768px)': {
    ...theme.customTypography.h5.bold,
  },
}));

export const ModalActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  // Mobile uses column-reverse so primary actions can remain last in markup.
  flexDirection: 'column-reverse',
  justifyContent: 'flex-end',
  gap: theme.customSpacing[3],
  '& > button, & > a': {
    width: '100%',
  },
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    gap: theme.customSpacing[4],
    '& > button, & > a': {
      width: 'auto',
    },
  },
}));

export const ModalContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[6],
}));

export const SectionedHeader = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  position: 'relative',
  paddingLeft: theme.customSpacing[6],
  paddingRight: theme.customSpacing[6],
  paddingTop: theme.customSpacing[8],
  paddingBottom: theme.customSpacing[8],
  borderBottom: `1px solid ${theme.semantic.divider}`,
  '@media (min-width: 768px)': {
    paddingLeft: theme.customSpacing[8],
    paddingRight: theme.customSpacing[8],
  },
}));

export const SectionedContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[4],
  paddingLeft: theme.customSpacing[6],
  paddingRight: theme.customSpacing[6],
  paddingTop: theme.customSpacing[5],
  paddingBottom: theme.customSpacing[5],
  '& > *': { flexShrink: 0 },
  '@media (min-width: 768px)': {
    paddingLeft: theme.customSpacing[8],
    paddingRight: theme.customSpacing[8],
  },
}));

export const SectionedActions = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  paddingLeft: theme.customSpacing[6],
  paddingRight: theme.customSpacing[6],
  paddingTop: theme.customSpacing[8],
  paddingBottom: theme.customSpacing[8],
  borderTop: `1px solid ${theme.semantic.divider}`,
  '@media (min-width: 768px)': {
    paddingLeft: theme.customSpacing[8],
    paddingRight: theme.customSpacing[8],
  },
}));
