'use client';

import { createTheme } from '@mui/material/styles';
import {
  colors,
  semanticLight,
  semanticDark,
  semantic,
  typographyVariants,
  typography,
  display,
  typeScale,
  fontFamilies,
  fontWeights,
  spacingBase,
  spacing,
  inputHeights,
  buttonMinWidths,
  borderRadius,
  shadows,
  surfaceOverlay,
  textTrim,
  breakpoints,
} from './tokens';
import type { ColorMode } from './tokens';

declare module '@mui/material/styles' {
  interface Theme {
    colors: typeof colors;
    // Runtime values are CSS vars (var(--sc-*)); type reflects semanticLight shape
    semantic: typeof semantic;
    // Prefixed to avoid shadowing MUI's built-in theme.spacing(), theme.shadows[], theme.shape
    customSpacing: typeof spacing;
    customShadows: typeof shadows;
    customBorderRadius: typeof borderRadius;
    customTypography: typeof typography;
    typographyVariants: typeof typographyVariants;
    display: typeof display;
    typeScale: typeof typeScale;
    fontWeights: typeof fontWeights;
    fontFamilies: typeof fontFamilies;
    inputHeights: typeof inputHeights;
    buttonMinWidths: typeof buttonMinWidths;
    surfaceOverlay: typeof surfaceOverlay;
    textTrim: typeof textTrim;
  }
  interface ThemeOptions {
    colors?: typeof colors;
    semantic?: typeof semantic;
    customSpacing?: typeof spacing;
    customShadows?: typeof shadows;
    customBorderRadius?: typeof borderRadius;
    customTypography?: typeof typography;
    typographyVariants?: typeof typographyVariants;
    display?: typeof display;
    typeScale?: typeof typeScale;
    fontWeights?: typeof fontWeights;
    fontFamilies?: typeof fontFamilies;
    inputHeights?: typeof inputHeights;
    buttonMinWidths?: typeof buttonMinWidths;
    surfaceOverlay?: typeof surfaceOverlay;
    textTrim?: typeof textTrim;
  }
}

/**
 * Creates the MUI theme for a given color mode.
 * Uses raw semantic values (not CSS vars) because MUI needs concrete values at theme creation.
 */
export function createAppTheme(mode: ColorMode = 'light') {
  const s = mode === 'dark' ? semanticDark : semanticLight;

  return createTheme({
    spacing: spacingBase,

    breakpoints: {
      values: breakpoints,
    },

    shape: {
      borderRadius: 12,
    },

    // ── Custom token scales — accessible as theme.* in styled() ──
    colors,
    semantic,
    customSpacing: spacing,
    customShadows: shadows,
    customBorderRadius: borderRadius,
    customTypography: typography,
    typographyVariants,
    display,
    typeScale,
    fontWeights,
    fontFamilies,
    inputHeights,
    buttonMinWidths,
    surfaceOverlay,
    textTrim,

    palette: {
      mode,
      primary: {
        main: s.primary.main,
        dark: s.primary.dark,
        light: s.primary.light,
        contrastText: s.primary.contrastText,
      },
      secondary: {
        main: s.secondary.main,
        dark: s.secondary.dark,
        light: s.secondary.light,
        contrastText: s.secondary.contrastText,
      },
      error: {
        main: s.error.main,
        dark: s.error.dark,
        light: s.error.light,
        contrastText: s.error.contrastText,
      },
      warning: {
        main: s.warning.main,
        dark: s.warning.dark,
        light: s.warning.light,
        contrastText: s.warning.contrastText,
      },
      info: {
        main: s.info.main,
        dark: s.info.dark,
        light: s.info.light,
        contrastText: s.info.contrastText,
      },
      success: {
        main: s.success.main,
        dark: s.success.dark,
        light: s.success.light,
        contrastText: s.success.contrastText,
      },
      text: {
        primary: s.text.primary,
        secondary: s.text.secondary,
        disabled: s.text.disabled,
      },
      background: {
        default: s.background.default,
        paper: s.background.paper,
      },
      divider: s.divider,
      action: s.action,
      common: s.common,
    },

    typography: {
      fontFamily: fontFamilies.body,
      ...typographyVariants,
    },

    shadows: [
      shadows.none,
      shadows.sm,
      shadows.base,
      shadows.md,
      shadows.md,
      shadows.lg,
      shadows.lg,
      shadows.lg,
      shadows.xl,
      shadows.xl,
      shadows.xl,
      shadows.xl,
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
    ],

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            boxShadow: 'none',
            borderRadius: borderRadius.xl,
            fontFamily: fontFamilies.body,
            fontWeight: typographyVariants.button.fontWeight,
            fontSize: typographyVariants.button.fontSize,
            lineHeight: typographyVariants.button.lineHeight,
            '&:hover': { boxShadow: 'none' },
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'var(--sc-common-white)',
            backgroundImage: 'var(--sc-surface-overlay)',
            color: 'inherit',
            borderBottom: '1px solid var(--sc-divider)',
          },
        },
      },

      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: '88px !important',
          },
        },
      },

      MuiCssBaseline: {
        styleOverrides: {
          // Overlay scrollbar — thin, no gutter.
          // Color switching is handled by a raw <style> tag in ThemeRegistry
          // to avoid Emotion cache conflicts between light/dark CssBaseline instances.
          '*, *::before, *::after': {
            scrollbarWidth: 'thin',
          },
          body: {
            fontFamily: fontFamilies.body,
            // Use CSS var so a single rule switches on mode change
            // (emotion caches both light+dark CssBaseline rules;
            //  concrete values can't reliably override each other)
            backgroundColor: 'var(--sc-background-default)',
            color: 'var(--sc-text-primary)',
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: s.divider,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: s.divider,
          },
        },
      },

      // MuiPaper: MUI's built-in dark elevation overlay is active automatically
      // when palette.mode === 'dark'. No override needed — Paper surfaces get
      // progressively lighter based on their `elevation` prop.

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.full,
            fontFamily: fontFamilies.body,
          },
        },
      },

      MuiAvatar: {
        styleOverrides: {
          root: {
            fontFamily: fontFamilies.body,
          },
        },
      },

      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: fontFamilies.body,
          },
        },
      },
    },
  });
}

/** Default light theme for backward compatibility. */
const theme = createAppTheme('light');
export default theme;
