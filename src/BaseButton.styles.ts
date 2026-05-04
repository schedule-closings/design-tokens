'use client';

import type React from 'react';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import type { BaseButtonVariant, BaseButtonColor, BaseButtonSize } from './BaseButton';

/* ------------------------------------------------------------------ */
/*  getVariantColorStyles                                             */
/* ------------------------------------------------------------------ */

function getVariantColorStyles(
  theme: import('@mui/material/styles').Theme,
): Record<BaseButtonVariant, Partial<Record<BaseButtonColor, Record<string, unknown>>>> {
  return {
    filled: {
      primary: {
        backgroundColor: theme.semantic.primary.main,
        color: theme.semantic.primary.contrastText,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.semantic.primary.dark },
      },
      secondary: {
        backgroundColor: theme.semantic.secondary.main,
        color: theme.semantic.secondary.contrastText,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.semantic.secondary.dark },
      },
      neutral: {
        backgroundColor: theme.semantic.text.primary,
        color: theme.semantic.common.white,
        border: '1px solid transparent',
        '&:hover': { opacity: 0.85 },
      },
      success: {
        backgroundColor: theme.semantic.success.main,
        color: theme.semantic.common.white,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.semantic.success.dark },
      },
      error: {
        backgroundColor: theme.semantic.error.main,
        color: theme.semantic.common.white,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.semantic.error.dark },
      },
      alert: {
        backgroundColor: theme.semantic.alert.main,
        color: theme.semantic.common.white,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.semantic.alert.dark },
      },
      warning: {
        backgroundColor: theme.semantic.warning.main,
        color: theme.semantic.common.white,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.semantic.warning.dark },
      },
    },
    outline: {
      primary: {
        backgroundColor: 'transparent',
        color: theme.semantic.primary.main,
        border: `1px solid ${theme.semantic.primary.main}`,
        '&:hover': { backgroundColor: theme.semantic.primary.hover },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.semantic.secondary.main,
        border: `1px solid ${theme.semantic.secondary.main}`,
        '&:hover': { backgroundColor: theme.semantic.secondary.hover },
      },
      neutral: {
        backgroundColor: 'transparent',
        color: theme.semantic.text.primary,
        border: `1px solid ${theme.semantic.action.disabled}`,
        '&:hover': { backgroundColor: theme.semantic.action.hover },
      },
      success: {
        backgroundColor: 'transparent',
        color: theme.semantic.success.main,
        border: `1px solid ${theme.semantic.success.main}`,
        '&:hover': { backgroundColor: `rgba(22,163,74,0.04)` },
        '[data-color-mode="dark"] &': { '&:hover': { backgroundColor: `rgba(34,197,94,0.08)` } },
      },
      error: {
        backgroundColor: 'transparent',
        color: theme.semantic.error.main,
        border: `1px solid ${theme.semantic.error.main}`,
        '&:hover': { backgroundColor: `rgba(220,38,38,0.04)` },
        '[data-color-mode="dark"] &': { '&:hover': { backgroundColor: `rgba(239,68,68,0.08)` } },
      },
      alert: {
        backgroundColor: 'transparent',
        color: theme.semantic.alert.main,
        border: `1px solid ${theme.semantic.alert.main}`,
        '&:hover': { backgroundColor: `rgba(234,179,8,0.06)` },
      },
      warning: {
        backgroundColor: 'transparent',
        color: theme.semantic.warning.main,
        border: `1px solid ${theme.semantic.warning.main}`,
        '&:hover': { backgroundColor: `rgba(234,88,12,0.06)` },
      },
    },
    ghost: {
      primary: {
        backgroundColor: 'transparent',
        color: theme.semantic.primary.main,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.semantic.primary.hover },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.semantic.secondary.main,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.semantic.secondary.hover },
      },
      neutral: {
        backgroundColor: 'transparent',
        color: theme.semantic.text.secondary,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.semantic.action.hover },
      },
      success: {
        backgroundColor: 'transparent',
        color: theme.semantic.success.main,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: `rgba(22,163,74,0.04)` }, // green[600] at 4%
        '[data-color-mode="dark"] &': { '&:hover': { backgroundColor: `rgba(34,197,94,0.08)` } }, // green[500] at 8%
      },
      error: {
        backgroundColor: 'transparent',
        color: theme.semantic.error.main,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: `rgba(220,38,38,0.04)` }, // red[600] at 4%
        '[data-color-mode="dark"] &': { '&:hover': { backgroundColor: `rgba(239,68,68,0.08)` } }, // red[500] at 8%
      },
      alert: {
        backgroundColor: 'transparent',
        color: theme.semantic.alert.main,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: `rgba(199,135,0,0.04)` }, // yellow[600] at 4%
        '[data-color-mode="dark"] &': { '&:hover': { backgroundColor: `rgba(234,179,8,0.08)` } }, // yellow[500] at 8%
      },
      warning: {
        backgroundColor: 'transparent',
        color: theme.semantic.warning.main,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: `rgba(234,88,12,0.04)` }, // orange[600] at 4%
        '[data-color-mode="dark"] &': { '&:hover': { backgroundColor: `rgba(249,115,22,0.08)` } }, // orange[500] at 8%
      },
    },
    duotone: {
      primary: {
        backgroundColor: theme.colors.blue[100],
        color: theme.semantic.primary.dark,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.colors.blue[200] },
        '[data-color-mode="dark"] &': {
          backgroundColor: `color-mix(in srgb, ${theme.semantic.primary.main} 12%, transparent)`,
          color: theme.semantic.primary.dark,
          '&:hover': { backgroundColor: `color-mix(in srgb, ${theme.semantic.primary.main} 20%, transparent)` },
        },
      },
      secondary: {
        backgroundColor: theme.colors.purple[100],
        color: theme.semantic.secondary.dark,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.colors.purple[200] },
        '[data-color-mode="dark"] &': {
          backgroundColor: `color-mix(in srgb, ${theme.semantic.secondary.main} 12%, transparent)`,
          color: theme.semantic.secondary.dark,
          '&:hover': { backgroundColor: `color-mix(in srgb, ${theme.semantic.secondary.main} 20%, transparent)` },
        },
      },
      neutral: {
        backgroundColor: theme.colors.slate[100],
        color: theme.semantic.text.primary,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.colors.slate[200] },
        '[data-color-mode="dark"] &': {
          backgroundColor: `color-mix(in srgb, ${theme.colors.slate[500]} 12%, transparent)`,
          color: theme.semantic.text.primary,
          '&:hover': { backgroundColor: `color-mix(in srgb, ${theme.colors.slate[500]} 20%, transparent)` },
        },
      },
      success: {
        backgroundColor: theme.colors.green[100],
        color: theme.semantic.success.dark,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.colors.green[200] },
        '[data-color-mode="dark"] &': {
          backgroundColor: `color-mix(in srgb, ${theme.semantic.success.main} 12%, transparent)`,
          color: theme.semantic.success.dark,
          '&:hover': { backgroundColor: `color-mix(in srgb, ${theme.semantic.success.main} 20%, transparent)` },
        },
      },
      error: {
        backgroundColor: theme.colors.red[100],
        color: theme.semantic.error.dark,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.colors.red[200] },
        '[data-color-mode="dark"] &': {
          backgroundColor: `color-mix(in srgb, ${theme.semantic.error.main} 12%, transparent)`,
          color: theme.semantic.error.dark,
          '&:hover': { backgroundColor: `color-mix(in srgb, ${theme.semantic.error.main} 20%, transparent)` },
        },
      },
      alert: {
        backgroundColor: theme.colors.yellow[100],
        color: theme.semantic.alert.dark,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.colors.yellow[200] },
        '[data-color-mode="dark"] &': {
          backgroundColor: `color-mix(in srgb, ${theme.semantic.alert.main} 12%, transparent)`,
          color: theme.semantic.alert.dark,
          '&:hover': { backgroundColor: `color-mix(in srgb, ${theme.semantic.alert.main} 20%, transparent)` },
        },
      },
      warning: {
        backgroundColor: theme.colors.orange[100],
        color: theme.semantic.warning.dark,
        border: '1px solid transparent',
        '&:hover': { backgroundColor: theme.colors.orange[200] },
        '[data-color-mode="dark"] &': {
          backgroundColor: `color-mix(in srgb, ${theme.semantic.warning.main} 12%, transparent)`,
          color: theme.semantic.warning.dark,
          '&:hover': { backgroundColor: `color-mix(in srgb, ${theme.semantic.warning.main} 20%, transparent)` },
        },
      },
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Custom props for StyledButtonBase                                 */
/* ------------------------------------------------------------------ */

interface StyledButtonBaseProps {
  btnVariant: BaseButtonVariant;
  btnColor: BaseButtonColor;
  btnSize: BaseButtonSize;
  hasStartIcon: boolean;
  hasEndIcon: boolean;
}

const styledProps: (keyof StyledButtonBaseProps)[] = [
  'btnVariant',
  'btnColor',
  'btnSize',
  'hasStartIcon',
  'hasEndIcon',
];

/* ------------------------------------------------------------------ */
/*  StyledButtonBase                                                  */
/* ------------------------------------------------------------------ */

export const StyledButtonBase = styled(ButtonBase, {
  shouldForwardProp: (prop) => !styledProps.includes(prop as keyof StyledButtonBaseProps),
})<StyledButtonBaseProps>(({ theme, btnVariant, btnColor, btnSize, hasStartIcon, hasEndIcon }) => {
  const isSmall = btnSize === 'small';
  const isNoPad = btnSize === 'no-padding';

  // Padding per size
  const pyToken = isNoPad ? '0px' : isSmall ? theme.customSpacing[2] : theme.customSpacing[3];
  const pxBase = isNoPad ? '0px' : isSmall ? theme.customSpacing[3] : theme.customSpacing[3];
  const pxWide = isNoPad ? '0px' : isSmall ? theme.customSpacing['3.5'] : theme.customSpacing['3.5'];

  const paddingStyles =
    hasStartIcon && !hasEndIcon
      ? { paddingLeft: pxBase, paddingRight: pxWide, paddingTop: pyToken, paddingBottom: pyToken }
      : !hasStartIcon && hasEndIcon
        ? { paddingLeft: pxWide, paddingRight: pxBase, paddingTop: pyToken, paddingBottom: pyToken }
        : { paddingLeft: pxBase, paddingRight: pxBase, paddingTop: pyToken, paddingBottom: pyToken };

  const btnRadius = isSmall ? theme.customBorderRadius.lg : theme.customBorderRadius.xl;
  const btnFontSize = isSmall ? '14px' : '16px';

  const variantColorStyles = getVariantColorStyles(theme);

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.customSpacing[1],
    borderRadius: isNoPad ? 0 : btnRadius,
    fontSize: btnFontSize,
    lineHeight: 1,
    fontWeight: 400,
    ...(theme.textTrim as Record<string, string>),
    letterSpacing: '0',
    fontFamily: 'inherit',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    height: isNoPad ? undefined : isSmall ? theme.inputHeights.small : theme.inputHeights.base,
    minWidth: isNoPad ? undefined : isSmall ? theme.buttonMinWidths.small : theme.buttonMinWidths.base,
    ...paddingStyles,
    ...(variantColorStyles[btnVariant]?.[btnColor] ?? {}),
    '&.Mui-disabled': {
      opacity: 0.4,
      pointerEvents: 'none',
    },
  };
});

/* ------------------------------------------------------------------ */
/*  ButtonIconWrap                                                    */
/* ------------------------------------------------------------------ */

export const ButtonIconWrap = styled(Box)<{ component?: React.ElementType }>({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
});
