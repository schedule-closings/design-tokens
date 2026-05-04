// ─────────────────────────────────────────────────────────────────
// SEMANTIC TOKENS
// Source: Figma — SV Design System node 2756-8028 (MUI Variables)
// Each group aliases primitive `colors` values to contextual roles.
// ─────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { colors } from './colors';

/** Raw light-mode semantic values (used for CSS var generation and design system preview). */
export const semanticLight = {
  // ── Primary — blue scale ───────────────────────────────────────
  primary: {
    main: colors.blue[600], // #2563eb  Primary/main
    dark: colors.blue[800], // #1e40af  Primary/dark
    light: colors.blue[400], // #60a5fa  Primary/light
    contrastText: colors.white, // #ffffff  primary/contrastText
    // Interaction states (derived, not in Figma variables)
    hover: 'rgba(37,99,235,0.04)',
    focus: 'rgba(37,99,235,0.12)',
    focusVisible: 'rgba(37,99,235,0.30)',
    outlinedBorder: 'rgba(37,99,235,0.50)',
    swatch: colors.blue[100], // #dbeafe
  },

  // ── Secondary — purple scale ───────────────────────────────────
  secondary: {
    main: colors.purple[600], // #9333ea  Secondary/main
    dark: colors.purple[800], // #6b21a8  Secondary/dark
    light: colors.purple[400], // #c084fc  Secondary/light
    contrastText: colors.white, // #ffffff  secondary/contrastText
    hover: 'rgba(147,51,234,0.04)',
    focus: 'rgba(147,51,234,0.12)',
    focusVisible: 'rgba(147,51,234,0.30)',
    outlinedBorder: 'rgba(147,51,234,0.50)',
  },

  // ── Error — red scale ──────────────────────────────────────────
  error: {
    main: colors.red[600], // #dc2626  Error/main
    dark: colors.red[800], // #991b1b  Error/dark
    light: colors.red[400], // #f87171  Error/light
    contrastText: colors.white, // #ffffff  Error/contrastText
  },

  // ── Warning — orange scale ─────────────────────────────────────
  warning: {
    main: colors.orange[600], // #ea580c  Warning/main
    dark: colors.orange[800], // #9a3412  Warning/dark
    light: colors.orange[400], // #fb923c  Warning/light
    contrastText: colors.white, // #ffffff  Warning/contrastText
  },

  // ── Alert — yellow scale (non-critical notices) ────────────────
  alert: {
    main: colors.yellow[600], // #c78700  Alert/main
    dark: colors.yellow[700], // #a16207  Alert/dark
    light: colors.yellow[400], // #facc15  Alert/light
    contrastText: colors.white, // #ffffff  Alert/contrastText
  },

  // ── Info — blue scale (same hue as primary) ────────────────────
  info: {
    main: colors.blue[600], // #2563eb  Info/main
    dark: colors.blue[800], // #1e40af  Info/dark
    light: colors.blue[400], // #60a5fa  Info/light
    contrastText: colors.white, // #ffffff  Info/contrastText
  },

  // ── Success — green scale ──────────────────────────────────────
  success: {
    main: colors.green[600], // #16a34a  Success/main
    dark: colors.green[800], // #166534  Success/dark
    light: colors.green[400], // #4ade80  Success/light
    contrastText: colors.white, // #ffffff  Success/contrastText
  },

  // ── Text ───────────────────────────────────────────────────────
  text: {
    primary: colors.slate[950], // #020617  Text/primary
    secondary: 'rgba(2,6,23,0.60)', //          text/secondary  (slate/950 @ 60%)
    disabled: 'rgba(0,0,0,0.38)', //          text/disabled   (#00000061)
    hint: 'rgba(0,0,0,0.38)',
  },

  // ── Background ─────────────────────────────────────────────────
  background: {
    default: '#f6f8ff', //          Background/default (all elevations)
    paper: '#f6f8ff', //          Background/paper-elevation-0
  },

  // ── Divider ────────────────────────────────────────────────────
  divider: colors.slate[300], // #cbd5e1  Divider/divider

  // ── Action states ──────────────────────────────────────────────
  action: {
    active: 'rgba(0,0,0,0.56)', // #0000008f  Action/active
    hover: 'rgba(0,0,0,0.04)', // #0000000a  Action/hover
    selected: 'rgba(0,0,0,0.08)', // #00000014  Action/selected
    disabled: 'rgba(0,0,0,0.38)', // #00000061  Action/disabled
    disabledBackground: 'rgba(0,0,0,0.12)', // #0000001f  Action/disabledBackground
    focus: 'rgba(0,0,0,0.12)', // #0000001f  Action/focus
  },

  // ── Border — field / container outlines ─────────────────────────
  border: {
    default: colors.gray[500],  // #6b7280  default field border
    strong: colors.gray[800],   // #1f2937  focused / active field border
  },

  // ── Backdrop — modal overlay ──────────────────────────────────
  backdrop: {
    default: 'rgba(0,0,0,0.78)',
    blur: '8px',
  },

  // ── Mica — dark-mode glass-like surface border ────────────────
  mica: {
    border: 'rgba(255,255,255,0.08)',
  },

  // ── Common ─────────────────────────────────────────────────────
  common: {
    black: colors.gray[950], // #030712  Common/black
    white: colors.white, // #ffffff  Common/white
  },

  // ── Tag — Version History type tags ────────────────────────────
  // One background/foreground pair per tag variant.
  // Background is a 10% tint of the primitive accent; foreground is the
  // darker shade for adequate contrast on light surfaces.
  tag: {
    featureBg: 'rgba(37,99,235,0.10)',   // blue 600 @ 10%
    featureFg: colors.blue[700],         // #1d4ed8
    fixBg: 'rgba(220,38,38,0.10)',       // red 600 @ 10%
    fixFg: colors.red[700],              // #b91c1c
    refactorBg: 'rgba(217,119,6,0.10)',  // amber 600 @ 10%
    refactorFg: colors.amber[700],       // #b45309
    choreBg: 'rgba(100,116,139,0.10)',   // slate 500 @ 10%
    choreFg: colors.slate[600],          // #475569
    docsBg: 'rgba(147,51,234,0.10)',     // purple 600 @ 10%
    docsFg: colors.purple[700],          // #7e22ce
    createdBg: 'rgba(22,163,74,0.10)',   // green 600 @ 10%
    createdFg: colors.green[700],        // #15803d
  },
} as const;

// ─────────────────────────────────────────────────────────────────
// SEMANTIC TOKENS — DARK MODE
// Derived from light mode: backgrounds darken, text lightens,
// accent colors shift to lighter shades for contrast on dark surfaces.
// ─────────────────────────────────────────────────────────────────

export const semanticDark = {
  // ── Primary — blue (lighter on dark bg) ─────────────────────
  primary: {
    main: colors.blue[400],        // #60a5fa
    dark: colors.blue[300],        // #93bbfd
    light: colors.blue[600],       // #2563eb
    contrastText: colors.slate[950], // #020617
    hover: 'rgba(96,165,250,0.08)',
    focus: 'rgba(96,165,250,0.16)',
    focusVisible: 'rgba(96,165,250,0.30)',
    outlinedBorder: 'rgba(96,165,250,0.50)',
    swatch: colors.blue[900],      // #1e3a5f
  },

  // ── Secondary — purple ──────────────────────────────────────
  secondary: {
    main: colors.purple[400],      // #c084fc
    dark: colors.purple[300],      // #d8b4fe
    light: colors.purple[600],     // #9333ea
    contrastText: colors.slate[950],
    hover: 'rgba(192,132,252,0.08)',
    focus: 'rgba(192,132,252,0.16)',
    focusVisible: 'rgba(192,132,252,0.30)',
    outlinedBorder: 'rgba(192,132,252,0.50)',
  },

  // ── Error — red ─────────────────────────────────────────────
  error: {
    main: colors.red[400],         // #f87171
    dark: colors.red[300],         // #fca5a5
    light: colors.red[600],        // #dc2626
    contrastText: colors.slate[950],
  },

  // ── Warning — orange ────────────────────────────────────────
  warning: {
    main: colors.orange[400],      // #fb923c
    dark: colors.orange[300],      // #fdba74
    light: colors.orange[600],     // #ea580c
    contrastText: colors.slate[950],
  },

  // ── Alert — yellow ──────────────────────────────────────────
  alert: {
    main: colors.yellow[400],      // #facc15
    dark: colors.yellow[300],      // #fde047
    light: colors.yellow[600],     // #c78700
    contrastText: colors.slate[950],
  },

  // ── Info — blue ─────────────────────────────────────────────
  info: {
    main: colors.blue[400],        // #60a5fa
    dark: colors.blue[300],        // #93bbfd
    light: colors.blue[600],       // #2563eb
    contrastText: colors.slate[950],
  },

  // ── Success — green ─────────────────────────────────────────
  success: {
    main: colors.green[400],       // #4ade80
    dark: colors.green[300],       // #86efac
    light: colors.green[600],      // #16a34a
    contrastText: colors.slate[950],
  },

  // ── Text (light on dark) ────────────────────────────────────
  text: {
    primary: colors.slate[50],     // #f8fafc
    secondary: 'rgba(248,250,252,0.60)', // slate-50 @ 60%
    disabled: 'rgba(255,255,255,0.38)',
    hint: 'rgba(255,255,255,0.38)',
  },

  // ── Background (dark surfaces) ──────────────────────────────
  background: {
    default: colors.slate[900],     // #0f172a
    paper: colors.slate[900],      // #0f172a
  },

  // ── Divider (white @ 12% — subtle, low visual weight on dark surfaces) ──
  divider: 'rgba(255, 255, 255, 0.12)',

  // ── Action states (light on dark) ───────────────────────────
  action: {
    active: 'rgba(255,255,255,0.56)',
    hover: 'rgba(255,255,255,0.08)',
    selected: 'rgba(255,255,255,0.12)',
    disabled: 'rgba(255,255,255,0.38)',
    disabledBackground: 'rgba(255,255,255,0.12)',
    focus: 'rgba(255,255,255,0.12)',
  },

  // ── Border — field / container outlines (lighter on dark) ───
  border: {
    default: colors.gray[500],     // #6b7280  same as light
    strong: colors.gray[300],      // #d1d5db  lighter on dark bg
  },

  // ── Backdrop — modal overlay (slightly darker on dark mode) ──
  backdrop: {
    default: 'rgba(0,0,0,0.85)',
    blur: '8px',
  },

  // ── Mica — glass-like surface border on dark surfaces ────────
  mica: {
    border: 'rgba(255,255,255,0.08)',
  },

  // ── Common ──────────────────────────────────────────────────
  common: {
    black: colors.white,           // inverted for dark mode
    white: colors.slate[900],      // #0f172a — base dark surface; MUI elevation overlay lightens it
  },

  // ── Tag — Version History type tags (dark) ────────────────────
  // Backgrounds are higher-alpha tints for visibility; foregrounds
  // flip to lighter shades for legibility on dark surfaces.
  tag: {
    featureBg: 'rgba(96,165,250,0.18)',   // blue 400 @ 18%
    featureFg: colors.blue[300],          // #93c5fd
    fixBg: 'rgba(248,113,113,0.18)',      // red 400 @ 18%
    fixFg: colors.red[300],               // #fca5a5
    refactorBg: 'rgba(251,146,60,0.18)',  // orange 400 @ 18%
    refactorFg: colors.amber[300],        // #fcd34d
    choreBg: 'rgba(148,163,184,0.18)',    // slate 400 @ 18%
    choreFg: colors.slate[300],           // #cbd5e1
    docsBg: 'rgba(192,132,252,0.18)',     // purple 400 @ 18%
    docsFg: colors.purple[300],           // #d8b4fe
    createdBg: 'rgba(74,222,128,0.18)',   // green 400 @ 18%
    createdFg: colors.green[300],         // #86efac
  },
} as const;

// ─── Dark mode elevation overlay ─────────────────────────────────────────────
// MUI applies a semi-transparent white overlay on Paper surfaces in dark mode
// based on elevation. This utility replicates the same formula for custom
// components (Box) that don't use MUI Paper.
//
// Usage:  sx={{ backgroundImage: darkElevationOverlay(2) }}
//         (returns 'none' in light mode — safe to apply unconditionally)
//
// Standard levels: 1→5%, 2→7%, 3→8%, 4→9%, 6→11%, 8→12%, 12→14%, 16→15%, 24→16%

const OVERLAY_ALPHAS: Record<number, number> = {
  0: 0, 1: 0.05, 2: 0.07, 3: 0.08, 4: 0.09, 6: 0.11,
  8: 0.12, 12: 0.14, 16: 0.15, 24: 0.16,
};

/** Returns a CSS `background-image` value for dark mode elevation overlay. */
export function darkElevationOverlay(elevation: number): string {
  const alpha = OVERLAY_ALPHAS[elevation] ?? Math.min(0.05 + elevation * 0.005, 0.16);
  return `linear-gradient(rgba(255,255,255,${alpha}), rgba(255,255,255,${alpha}))`;
}

// ─── Color mode type + resolver ─────────────────────────────────────────────

export type ColorMode = 'light' | 'dark';

/** Returns the raw semantic token set for the given mode (for design system preview etc.). */
export function getSemanticTokens(mode: ColorMode = 'light') {
  return mode === 'dark' ? semanticDark : semanticLight;
}

// ─── CSS Custom Properties for dark mode switching ──────────────────────────
// Flatten nested semantic tokens into --sc-{group}-{key} CSS variables.
// Components use `semanticVars.*` which resolves to `var(--sc-*)`.

type FlatMap = Record<string, string>;

// Use semanticLight as the shape template for CSS var generation
function flattenTokens(obj: Record<string, string | Record<string, string>>, prefix = 'sc'): FlatMap {
  const result: FlatMap = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      result[`--${prefix}-${key}`] = val;
    } else if (typeof val === 'object' && val !== null) {
      for (const [subKey, subVal] of Object.entries(val)) {
        if (typeof subVal === 'string') {
          result[`--${prefix}-${key}-${subKey}`] = subVal;
        }
      }
    }
  }
  return result;
}

/** Returns a CSS string of custom property declarations for a given mode. */
export function generateCSSVarBlock(mode: ColorMode): string {
  const tokens = mode === 'dark' ? semanticDark : semanticLight;
  const flat = flattenTokens(tokens);
  return Object.entries(flat).map(([k, v]) => `${k}: ${v};`).join('\n  ');
}

/** Convert hex (#rrggbb) to [r, g, b] tuple for rgba() usage in shadow tokens. */
const _hexRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

/** Full CSS string for both modes — inject into a <style> tag. */
export function generateCSSVarStylesheet(): string {
  // Focus glow values — light uses primary.main / error.main, dark uses primary.light / error.light
  const [pR, pG, pB] = _hexRgb(colors.blue[600]); // primary.main
  const [eR, eG, eB] = _hexRgb(colors.red[600]);  // error.main
  const [pLR, pLG, pLB] = _hexRgb(colors.blue[400]); // primary.light
  const [eLR, eLG, eLB] = _hexRgb(colors.red[400]);  // error.light

  return `
:root, [data-color-mode="light"] {
  ${generateCSSVarBlock('light')}
  --sc-surface-overlay-subtle: none;
  --sc-surface-overlay: none;
  --sc-surface-overlay-mid: none;
  --sc-surface-overlay-high: none;
  --sc-dt-row-base: ${colors.white};
  --sc-dt-sticky-stripe: ${colors.slate[100]};
  --sc-dt-selected-row: #eef2ff;
  --sc-dt-sticky-shadow: rgba(0,0,0,0.08);
  --sc-dt-empty-bg: ${colors.slate[50]};
  --sc-dt-empty-icon-bg: ${colors.blue[50]};
  --sc-panel-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.05);
  --sc-calendar-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.05);
  --sc-arrow-inactive-fill: ${colors.white};
  --sc-arrow-inactive-stroke: ${colors.gray[300]};
  --sc-arrow-active-fill: ${colors.blue[50]};
  --sc-arrow-active-stroke: ${semanticLight.primary.main};
  --sc-arrow-active-text: ${semanticLight.primary.dark};
  --sc-map-filter: grayscale(1) contrast(0.9) brightness(1.1);
  --sc-map-blend: luminosity;
  --sc-map-bg: #60a5fa;
  --sc-map-overlay: linear-gradient(135deg, #2563eb33 0%, #dbeafe88 100%);
  --sc-map-overlay-display: block;
  --sc-header-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.06), 0 6px 12px rgba(0,0,0,0.03);
  --sc-shadow-focus-primary: 0 0 0 1.25px rgba(${pR},${pG},${pB},0.25), 0 0 0.5px 4.5px rgba(${pR},${pG},${pB},0.2);
  --sc-shadow-focus-error: 0 0 0 1.25px rgba(${eR},${eG},${eB},0.15), 0 0 0.5px 4.5px rgba(${eR},${eG},${eB},0.2);
}
[data-color-mode="dark"] {
  ${generateCSSVarBlock('dark')}
  --sc-surface-overlay-subtle: linear-gradient(rgba(255,255,255,0.04), rgba(255,255,255,0.04));
  --sc-surface-overlay: ${darkElevationOverlay(2)};
  --sc-surface-overlay-mid: ${darkElevationOverlay(5)};
  --sc-surface-overlay-high: ${darkElevationOverlay(8)};
  --sc-dt-row-base: ${colors.slate[800]};
  --sc-dt-sticky-stripe: #253347;
  --sc-dt-selected-row: #1a2744;
  --sc-dt-sticky-shadow: rgba(0,0,0,0.45);
  --sc-dt-empty-bg: #172033;
  --sc-dt-empty-icon-bg: rgba(96,165,250,0.12);
  --sc-panel-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.10), 0 16px 24px rgba(0,0,0,0.04);
  --sc-calendar-shadow: 0 1px 2px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.20);
  --sc-arrow-inactive-fill: ${colors.slate[800]};
  --sc-arrow-inactive-stroke: ${colors.slate[600]};
  --sc-arrow-active-fill: rgba(37,99,235,0.2);
  --sc-arrow-active-stroke: ${colors.blue[400]};
  --sc-arrow-active-text: ${colors.blue[300]};
  --sc-map-filter: invert(1) hue-rotate(45deg) contrast(0.7) brightness(1.35) saturate(0.2);
  --sc-map-blend: luminosity;
  --sc-map-bg: #7d98d9;
  --sc-map-overlay: none;
  --sc-map-overlay-display: none;
  --sc-header-shadow: 0 1px 3px rgba(0,0,0,0.18), 0 3px 8px rgba(0,0,0,0.21), 0 8px 16px rgba(0,0,0,0.15), 0 16px 24px rgba(0,0,0,0.06);
  --sc-shadow-focus-primary: 0 0 0 1.25px rgba(${pR},${pG},${pB},0.25), 0 0 0.5px 4.5px rgba(${pLR},${pLG},${pLB},0.25);
  --sc-shadow-focus-error: 0 0 0 1.25px rgba(${eR},${eG},${eB},0.15), 0 0 0.5px 4.5px rgba(${eLR},${eLG},${eLB},0.3);
}`.trim();
}

// ─── Var-backed semantic tokens ─────────────────────────────────────────────
// Mirrors the `semantic` structure but every value is `var(--sc-...)`.
// Components import this and get automatic dark mode switching via CSS.

function buildVarBacked<T extends Record<string, string | Record<string, string>>>(obj: T, prefix = 'sc'): T {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      result[key] = `var(--${prefix}-${key})`;
    } else if (typeof val === 'object' && val !== null) {
      const sub: Record<string, string> = {};
      for (const subKey of Object.keys(val)) {
        sub[subKey] = `var(--${prefix}-${key}-${subKey})`;
      }
      result[key] = sub;
    }
  }
  return result as T;
}

/**
 * CSS-variable-backed semantic tokens.
 * Same shape as `semantic` but values are `var(--sc-primary-main)` etc.
 * Automatically switches when `data-color-mode` attribute changes on <html>.
 */
export const semanticVars = buildVarBacked(semanticLight);

/**
 * `semantic` — the default export for components.
 * Backed by CSS custom properties — automatically switches between light/dark
 * when `data-color-mode` attribute changes on <html>.
 */
export const semantic = semanticVars;

/**
 * Surface overlay CSS vars for dark mode elevation.
 * Apply via `backgroundImage` — `none` in light mode, white overlay in dark.
 *
 *   surfaceOverlay.subtle — 4% white: minimal tint for grouped areas, hint panels
 *   surfaceOverlay.base   — elevation 2 (7% white): cards, sidebars, inputs
 *   surfaceOverlay.mid    — elevation 5 (9% white): inline panels, calendar
 *   surfaceOverlay.high   — elevation 8 (12% white): dropdowns, popovers, modals
 */
export const surfaceOverlay = {
  subtle: 'var(--sc-surface-overlay-subtle)',
  base: 'var(--sc-surface-overlay)',
  mid: 'var(--sc-surface-overlay-mid)',
  high: 'var(--sc-surface-overlay-high)',
} as const;

export type SemanticColor = typeof semantic;

// ─── Dev-only token shape validation ──────────────────────────────────────────
const SemanticSchema = z.object({
  primary: z.object({ main: z.string(), light: z.string(), dark: z.string() }),
  error: z.object({ main: z.string(), light: z.string(), dark: z.string() }),
  success: z.object({ main: z.string(), light: z.string(), dark: z.string() }),
  alert: z.object({ main: z.string(), light: z.string(), dark: z.string() }),
  text: z.object({ primary: z.string(), secondary: z.string() }),
  background: z.object({ default: z.string() }),
  divider: z.string(),
  common: z.object({ white: z.string() }),
});

if (process.env.NODE_ENV === 'development') {
  const result = SemanticSchema.safeParse(semantic);
  if (!result.success) {
    console.error('[tokens] semantic token shape is invalid:', result.error.format());
  }
}
