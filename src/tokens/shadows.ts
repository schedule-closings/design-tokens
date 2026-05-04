// ─────────────────────────────────────────────────────────────────
// SHADOWS  (Figma Shadow Styles — Tailwind-compatible)
// ─────────────────────────────────────────────────────────────────

// Beautiful layered shadows — inspired by figma-beautiful-shadows / Josh W. Comeau.
// Each level stacks 2–4 layers with eased opacity (cubic-in-out), eased offset (quad-in),
// and eased blur (quad-out) to simulate a real point-light source.
//
// ADAPTIVE COLOR: shadows reference CSS custom properties --shadow-r/g/b so they
// automatically match whatever surface they sit on. Default fallback is slate-900
// (15 23 42). Use shadowColorVars(hexColor) to override on a colored container.
//
// Example:
//   import { shadows, shadowColorVars, colors } from '@/app/lib/tokens';
//   <Box sx={{ ...shadowColorVars(colors.green[900]), boxShadow: shadows.md }}>
const _c = `rgba(var(--shadow-r,15),var(--shadow-g,23),var(--shadow-b,42),`;

export const shadows = {
  none: 'none',

  // sm — near-flat: buttons, inputs, barely-lifted surfaces
  sm: [`0 1px 2px ${_c}0.06)`, `0 2px 4px ${_c}0.05)`].join(', '),

  // base — default card / panel elevation
  base: [`0 1px 2px ${_c}0.06)`, `0 2px 6px ${_c}0.06)`, `0 6px 12px ${_c}0.03)`].join(', '),

  // md — dropdowns, tooltips, popovers
  md: [
    `0 1px 3px ${_c}0.06)`,
    `0 3px 8px ${_c}0.07)`,
    `0 8px 16px ${_c}0.05)`,
    `0 16px 24px ${_c}0.02)`,
  ].join(', '),

  // lg — drawers, side panels, modals
  lg: [
    `0 2px 4px ${_c}0.06)`,
    `0 6px 12px ${_c}0.07)`,
    `0 14px 24px ${_c}0.06)`,
    `0 28px 40px ${_c}0.02)`,
  ].join(', '),

  // xl — major overlays, command palettes, full-coverage modals
  xl: [
    `0 4px 8px ${_c}0.05)`,
    `0 12px 20px ${_c}0.07)`,
    `0 24px 40px ${_c}0.06)`,
    `0 48px 64px ${_c}0.03)`,
  ].join(', '),

  // 2xl — dramatic hero cards, floating menus
  '2xl': [
    `0 8px 16px ${_c}0.05)`,
    `0 20px 40px ${_c}0.08)`,
    `0 40px 64px ${_c}0.07)`,
    `0 64px 96px ${_c}0.04)`,
  ].join(', '),

  inner: `inset 0 2px 4px ${_c}0.06)`,

  // modal — dramatic depth for centered modals (heavier than 2xl)
  modal: [
    '0 8px 16px rgba(0,0,0,0.12)',
    '0 20px 40px rgba(0,0,0,0.16)',
    '0 40px 64px rgba(0,0,0,0.14)',
    '0 64px 96px rgba(0,0,0,0.10)',
  ].join(', '),

  // modalDark — dark mode modal shadow (higher opacity for contrast)
  modalDark: [
    'inset 0 1px 0 rgba(255,255,255,0.06)',
    '0 8px 16px rgba(0,0,0,0.25)',
    '0 20px 40px rgba(0,0,0,0.30)',
    '0 40px 64px rgba(0,0,0,0.25)',
    '0 64px 96px rgba(0,0,0,0.15)',
  ].join(', '),

  // ── Focus glow — soft halo for input fields ──
  // Layered: tight 1px ring + subtle spread glow
  focusPrimary: 'var(--sc-shadow-focus-primary)',
  focusError: 'var(--sc-shadow-focus-error)',
} as const;

// Returns CSS custom-property overrides that color-match shadows to a surface.
// Pass the darkest shade of the background color (e.g. colors.green[900]).
// Works with MUI sx prop and React style prop.
//   <Box sx={{ ...shadowColorVars(colors.green[900]), boxShadow: shadows.md }}>
export function shadowColorVars(hex: string): Record<string, number> {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  return {
    '--shadow-r': parseInt(full.slice(0, 2), 16),
    '--shadow-g': parseInt(full.slice(2, 4), 16),
    '--shadow-b': parseInt(full.slice(4, 6), 16),
  };
}

// ─────────────────────────────────────────────────────────────────
// SHADOW FALL DIRECTION
// Transforms shadow offsets to cast in any of 8 directions.
//
// Usage:
//   import { shadows, shadowFall } from '@/app/lib/tokens';
//   <Box sx={{ boxShadow: shadowFall(shadows.md, 'top') }}>
//   <Box sx={{ boxShadow: shadowFall(shadows.lg, 'top-right') }}>
// ─────────────────────────────────────────────────────────────────

export type FallDirection =
  | 'bottom'       // default — shadow falls down
  | 'top'          // shadow falls up
  | 'left'         // shadow falls left
  | 'right'        // shadow falls right
  | 'top-left'     // shadow falls diagonally up-left
  | 'top-right'    // shadow falls diagonally up-right
  | 'bottom-left'  // shadow falls diagonally down-left
  | 'bottom-right'; // shadow falls diagonally down-right

// Direction vectors: [x-multiplier, y-multiplier]
// Default shadow direction is "bottom" → (0, +1)
const DIRECTION_VECTORS: Record<FallDirection, [number, number]> = {
  bottom:        [ 0,      1],
  top:           [ 0,     -1],
  left:          [-1,      0],
  right:         [ 1,      0],
  'top-left':    [-0.707, -0.707],
  'top-right':   [ 0.707, -0.707],
  'bottom-left': [-0.707,  0.707],
  'bottom-right':[ 0.707,  0.707],
};

/**
 * Transforms a shadow string to cast in a different direction.
 *
 * Parses multi-layer box-shadow values and rotates offsets.
 * Handles `inset` prefix. Returns `'none'` for empty/none inputs.
 *
 * @param shadow — a box-shadow string from `shadows.*`
 * @param direction — one of 8 directions (default: 'bottom')
 *
 * @example
 *   shadowFall(shadows.md, 'top')       // shadow rises upward
 *   shadowFall(shadows.lg, 'top-right') // shadow falls diagonally
 *   shadowFall(shadows.base, 'left')    // shadow falls left
 */
export function shadowFall(shadow: string, direction: FallDirection = 'bottom'): string {
  if (!shadow || shadow === 'none') return 'none';
  if (direction === 'bottom') return shadow; // no-op for default direction

  const [dx, dy] = DIRECTION_VECTORS[direction];

  // Split on commas that separate shadow layers (but not commas inside rgba)
  const layers = shadow.split(/,(?![^(]*\))/);

  return layers.map((layer) => {
    const trimmed = layer.trim();
    const isInset = trimmed.startsWith('inset');
    const rest = isInset ? trimmed.slice(5).trim() : trimmed;

    // Parse: <x-offset> <y-offset> <blur> [<spread>] <color>
    // Offsets are in px — match number+px patterns at the start
    const parts = rest.match(/^(-?\d+(?:\.\d+)?px)\s+(-?\d+(?:\.\d+)?px)\s+(.*)$/);
    if (!parts) return layer; // can't parse — return unchanged

    const origX = parseFloat(parts[1]);
    const origY = parseFloat(parts[2]);
    const remainder = parts[3]; // blur + spread + color

    // Original magnitude (distance from center)
    const magnitude = Math.sqrt(origX * origX + origY * origY);

    // New offsets using the direction vector
    const newX = Math.round(magnitude * dx * 100) / 100;
    const newY = Math.round(magnitude * dy * 100) / 100;

    const prefix = isInset ? 'inset ' : '';
    return `${prefix}${newX}px ${newY}px ${remainder}`;
  }).join(', ');
}
