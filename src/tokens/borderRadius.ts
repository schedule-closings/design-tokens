// ─────────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────────

export const borderRadius = {
  none: '0px',
  sm: '2px',
  default: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px', // primary button / card border radius
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
} as const;

// ─────────────────────────────────────────────────────────────────
// Derived token types — consumed by component prop interfaces
// ─────────────────────────────────────────────────────────────────
export type BorderRadiusKey = keyof typeof borderRadius;
