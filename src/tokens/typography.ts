// ─────────────────────────────────────────────────────────────────
// TYPOGRAPHY SCALE  (matches Figma Text Styles — font: Inter)
// Figma token name → { fontSize, lineHeight, fontWeight }
// ─────────────────────────────────────────────────────────────────

export const typeScale = {
  'text-xs': { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
  'text-sm': { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
  'text-base': { fontSize: '16px', lineHeight: '24px', fontWeight: 400 },
  'text-lg': { fontSize: '18px', lineHeight: '28px', fontWeight: 400 },
  'text-xl': { fontSize: '20px', lineHeight: '28px', fontWeight: 400 },
  'text-2xl': { fontSize: '24px', lineHeight: '32px', fontWeight: 400 },
  'text-3xl': { fontSize: '30px', lineHeight: '36px', fontWeight: 500 },
  'text-4xl': { fontSize: '36px', lineHeight: '40px', fontWeight: 500 },
  'text-5xl': { fontSize: '48px', lineHeight: '48px', fontWeight: 500 },
  'text-6xl': { fontSize: '60px', lineHeight: '60px', fontWeight: 600 },
  'text-7xl': { fontSize: '72px', lineHeight: '72px', fontWeight: 700 },
  'text-8xl': { fontSize: '96px', lineHeight: '96px', fontWeight: 800 },
  'text-9xl': { fontSize: '128px', lineHeight: '128px', fontWeight: 900 },
} as const;

// ─────────────────────────────────────────────────────────────────
// FONT WEIGHTS
// ─────────────────────────────────────────────────────────────────
export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ─────────────────────────────────────────────────────────────────
// FONT FAMILIES — semantic aliases resolved via CSS custom properties
// --font-body    is set in layout.tsx → Inter | Nohemi | Geist
// --font-display is set in layout.tsx → Geist (default) | Nohemi
// ─────────────────────────────────────────────────────────────────

export const fontFamilies = {
  body: 'var(--font-body), "Inter", sans-serif',
  display: 'var(--font-display), "Geist", sans-serif',
  mono: 'var(--font-roboto-mono), "Roboto Mono", "Courier New", monospace',
} as const;

// ─────────────────────────────────────────────────────────────────
// TYPOGRAPHY — full variant × weight token map
// Source: Figma SV Design System (OVjygxh5hpVujmD1gl4MB9) nodes 8-2 and 2793-4807
// Every variant (h1–h6, subtitle1/2, body1/2, caption) has 4 weight sub-styles:
//   Regular (400), Medium (500), Semibold (600), Bold (700)
// Exceptions: overline (Semibold 600 only), button (Regular 400 only)
// Usage:
//   typography.h1.semibold  →  { fontSize, fontWeight, lineHeight, letterSpacing }
//   typography.overline     →  single-weight token
// ─────────────────────────────────────────────────────────────────
interface TypographyBase {
  fontSize: string;
  lineHeight: number | string;
  letterSpacing: string;
  [key: string]: unknown;
}

interface TypographyWeightSet {
  regular: TypographyBase & { fontWeight: number };
  medium: TypographyBase & { fontWeight: number };
  semibold: TypographyBase & { fontWeight: number };
  bold: TypographyBase & { fontWeight: number };
}

function _w(base: TypographyBase): TypographyWeightSet {
  return {
    regular: { ...base, fontWeight: fontWeights.regular },
    medium: { ...base, fontWeight: fontWeights.medium },
    semibold: { ...base, fontWeight: fontWeights.semibold },
    bold: { ...base, fontWeight: fontWeights.bold },
  };
}

export const typography = {
  h1: _w({ fontSize: '96px', lineHeight: 1.167, letterSpacing: '-1.5px' }),
  h2: _w({ fontSize: '60px', lineHeight: 1.2, letterSpacing: '-0.5px' }),
  h3: _w({ fontSize: '48px', lineHeight: 1.167, letterSpacing: '0px' }),
  h4: _w({ fontSize: '34px', lineHeight: 1.235, letterSpacing: '0.25px' }),
  h5: _w({ fontSize: '24px', lineHeight: 1.334, letterSpacing: '0px' }),
  h6: _w({ fontSize: '20px', lineHeight: 1.6, letterSpacing: '0.15px' }),
  subtitle1: _w({ fontSize: '16px', lineHeight: 1.75, letterSpacing: '0.15px' }),
  subtitle2: _w({ fontSize: '14px', lineHeight: 1.57, letterSpacing: '0.1px' }),
  body1: _w({ fontSize: '16px', lineHeight: 1.5, letterSpacing: '0.15px' }),
  body2: _w({ fontSize: '14px', lineHeight: 1.43, letterSpacing: '0.17px' }),
  caption: _w({ fontSize: '12px', lineHeight: 1.66, letterSpacing: '0.4px' }),
  // single-weight variants:
  overline: {
    fontSize: '10px',
    fontWeight: fontWeights.semibold,
    lineHeight: '16px',
    letterSpacing: '0.4px',
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: '16px',
    fontWeight: fontWeights.regular,
    lineHeight: '24px',
    letterSpacing: '0px',
    textTransform: 'none' as const,
  },
} as const;

// ─────────────────────────────────────────────────────────────────
// DISPLAY TYPOGRAPHY — Display font (h1 → body1)
// Same variant × weight structure as `typography`, but with display fontFamily.
// Default: Geist Sans. Swap via public/fonts/font-config.json → displayFont: "nohemi"|"geist"
// Usage:  display.h1.semibold  →  { fontSize, fontWeight, lineHeight, letterSpacing, fontFamily }
// ─────────────────────────────────────────────────────────────────

interface DisplayWeightSet {
  regular: TypographyBase & { fontWeight: number; fontFamily: string };
  medium: TypographyBase & { fontWeight: number; fontFamily: string };
  semibold: TypographyBase & { fontWeight: number; fontFamily: string };
  bold: TypographyBase & { fontWeight: number; fontFamily: string };
}

function _dw(base: TypographyBase): DisplayWeightSet {
  return {
    regular: { ...base, fontWeight: fontWeights.regular, fontFamily: fontFamilies.display },
    medium: { ...base, fontWeight: fontWeights.medium, fontFamily: fontFamilies.display },
    semibold: { ...base, fontWeight: fontWeights.semibold, fontFamily: fontFamilies.display },
    bold: { ...base, fontWeight: fontWeights.bold, fontFamily: fontFamilies.display },
  };
}

export const display = {
  h1: _dw({ fontSize: '96px', lineHeight: 1.167, letterSpacing: '-1.5px' }),
  h2: _dw({ fontSize: '60px', lineHeight: 1.2, letterSpacing: '-0.5px' }),
  h3: _dw({ fontSize: '48px', lineHeight: 1.167, letterSpacing: '0px' }),
  h4: _dw({ fontSize: '34px', lineHeight: 1.235, letterSpacing: '0.25px' }),
  h5: _dw({ fontSize: '24px', lineHeight: 1.334, letterSpacing: '0px' }),
  h6: _dw({ fontSize: '20px', lineHeight: 1.6, letterSpacing: '0.15px' }),
  subtitle1: _dw({ fontSize: '16px', lineHeight: 1.75, letterSpacing: '0.15px' }),
  subtitle2: _dw({ fontSize: '14px', lineHeight: 1.57, letterSpacing: '0.1px' }),
  body1: _dw({ fontSize: '16px', lineHeight: 1.5, letterSpacing: '0.15px' }),
} as const;

// Mapping to MUI Typography variants (Regular weight as default — used by theme.js)
// Source: Figma SV Design System — node 2793-4807 (MUI Typography retrofit)
// typeScale weights (text-8xl=800, text-6xl=600, etc.) apply to raw custom text only.
export const typographyVariants = {
  h1: typography.h1.regular,
  h2: typography.h2.regular,
  h3: typography.h3.regular,
  h4: typography.h4.regular,
  h5: typography.h5.regular,
  h6: typography.h6.regular,
  subtitle1: typography.subtitle1.regular,
  subtitle2: typography.subtitle2.regular,
  body1: typography.body1.regular,
  body2: typography.body2.regular,
  caption: typography.caption.regular,
  overline: typography.overline,
  button: typography.button,
} as const;

// ─────────────────────────────────────────────────────────────────
// TEXT TRIM — progressive enhancement for precise text sizing
// Removes half-leading above/below text glyphs.
// Browsers that don't support it (Firefox) just ignore these properties.
//
// Usage:
//   import { textTrim } from '@/app/lib/tokens';
//   <Typography sx={{ ...textTrim }}>Precise text</Typography>
//
// Apply to: buttons, chips, badges, nav items, tabs — any single-line
// element where line-height inflation causes unwanted height.
// Do NOT apply to: paragraphs, multi-line text, body copy.
// ─────────────────────────────────────────────────────────────────

export const textTrim = {
  textBoxTrim: 'both',
  textBoxEdge: 'cap alphabetic',
} as const;
