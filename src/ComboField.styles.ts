'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

export const ComboWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const ComboLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  minWidth: 0,
  marginBottom: theme.customSpacing[2],
}));

export const ComboLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}));

export const ComboRequiredMark = styled(Box)<{ component?: React.ElementType }>(({ theme }) => ({
  ...theme.customTypography.body2.medium,
  color: theme.semantic.error.main,
  flexShrink: 0,
}));

export const ComboTrigger = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isFocused', 'isDisabled', 'isBase'].includes(prop as string),
})<{ isFocused?: boolean; isDisabled?: boolean; isBase?: boolean }>(
  ({ theme, isFocused, isDisabled, isBase }) => ({
    display: 'flex',
    alignItems: 'center',
    height: isBase ? theme.inputHeights.base : theme.inputHeights.small,
    backgroundColor: theme.semantic.common.white,
    border: `1px solid ${isFocused ? theme.semantic.border.strong : theme.semantic.border.default}`,
    borderRadius: isBase ? theme.customBorderRadius.xl : theme.customBorderRadius.lg,
    boxShadow: isFocused ? theme.customShadows.focusPrimary : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    cursor: isDisabled ? 'not-allowed' : 'default',
    opacity: isDisabled ? 0.6 : 1,
    overflow: 'hidden',
  })
);

export const ComboInputSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  paddingLeft: theme.customSpacing['3.5'],
  paddingRight: theme.customSpacing[2],
  minWidth: 0,
}));

export const ComboInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  ...theme.customTypography.body1.regular,
  lineHeight: 1,
  color: theme.semantic.text.primary,
  '& input': {
    padding: 0,
    color: 'inherit',
    '&::placeholder': { color: theme.semantic.text.secondary, opacity: 1 },
    '&:disabled': { cursor: 'not-allowed', WebkitTextFillColor: theme.semantic.text.disabled },
  },
}));

export const ComboDivider = styled(Box)(() => ({
  display: 'none',
}));

export const ComboOptionButton = styled(Box, {
  shouldForwardProp: (prop) => !['isOpen', 'isDisabled'].includes(prop as string),
})<{ isOpen?: boolean; isDisabled?: boolean }>(({ theme, isOpen, isDisabled }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  paddingLeft: theme.customSpacing[2],
  paddingRight: theme.customSpacing[2],
  marginRight: theme.customSpacing[1],
  alignSelf: 'center',
  height: `calc(100% - ${theme.customSpacing[2]})`,
  borderRadius: theme.customBorderRadius.lg,
  flexShrink: 0,
  background: 'none',
  border: 'none',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  color: theme.semantic.text.secondary,
  fontFamily: 'inherit',
  transition: 'background-color 0.15s',
  '&:hover': !isDisabled ? { backgroundColor: theme.semantic.action.hover } : {},
  '& .combo-chevron': {
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
    display: 'inline-flex',
  },
}));

export const ComboLeftIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'iconSize',
})<{ iconSize?: number }>(({ theme, iconSize = 20 }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  width: iconSize,
  height: iconSize,
  color: theme.semantic.text.secondary,
}));

export const ComboOptionLabelText = styled(Typography, {
  shouldForwardProp: (prop) => !['isSmall', 'isFocusedOrOpen'].includes(prop as string),
})<{ isSmall?: boolean; isFocusedOrOpen?: boolean }>(({ theme, isSmall, isFocusedOrOpen }) => ({
  ...(isSmall ? theme.customTypography.body2.regular : theme.customTypography.body1.regular),
  color: isFocusedOrOpen ? theme.semantic.text.primary : theme.semantic.text.secondary,
  whiteSpace: 'nowrap',
}));

export const ComboInlineTooltipWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  paddingRight: theme.customSpacing['1.5'],
}));

export const ComboOptionButtonWithTooltipGap = styled(Box, {
  shouldForwardProp: (prop) => !['isOpen', 'isDisabled', 'hasTooltipGap'].includes(prop as string),
})<{ isOpen?: boolean; isDisabled?: boolean; hasTooltipGap?: boolean } & { component?: React.ElementType }>(({ theme, isOpen, isDisabled, hasTooltipGap }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[1],
  paddingLeft: theme.customSpacing[2],
  paddingRight: hasTooltipGap ? theme.customSpacing[1] : theme.customSpacing[2],
  marginRight: theme.customSpacing[1],
  alignSelf: 'center',
  height: `calc(100% - ${theme.customSpacing[2]})`,
  borderRadius: theme.customBorderRadius.lg,
  flexShrink: 0,
  background: 'none',
  border: 'none',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  color: theme.semantic.text.secondary,
  fontFamily: 'inherit',
  transition: 'background-color 0.15s',
  '&:hover': !isDisabled ? { backgroundColor: theme.semantic.action.hover } : {},
  '& .combo-chevron': {
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
    display: 'inline-flex',
  },
}));
