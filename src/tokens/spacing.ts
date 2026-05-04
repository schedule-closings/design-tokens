// ─────────────────────────────────────────────────────────────────
// SPACING SCALE  (base unit: 4px — matches Figma spacing/N)
// theme.spacing(N) = N * 4px
// Figma variable → MUI equivalent:
//   spacing/1   = 4px  = theme.spacing(1)
//   spacing/3   = 12px = theme.spacing(3)
//   spacing/5   = 20px = theme.spacing(5)
//   spacing/6   = 24px = theme.spacing(6)
// ─────────────────────────────────────────────────────────────────

export const spacingBase = 4; // px

// Named spacing values for documentation / non-MUI use
export const spacing = {
  px: '1px',
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
} as const;

// ─────────────────────────────────────────────────────────────────
// INPUT HEIGHTS — fixed pixel values for consistent cross-component alignment
// All input-like components (TextInputField, SelectField, DatePickerField,
// ComboField, LocationSuggestionField, BaseButton) share these heights.
// ─────────────────────────────────────────────────────────────────

export const inputHeights = {
  base: 46,  // px — standard input/button height
  small: 38, // px — compact variant
} as const;

/** Minimum widths for buttons — ensures uniformity when label text is short. */
export const buttonMinWidths = {
  base: 100, // px — standard button min width
  small: 80, // px — compact variant
} as const;

// ─────────────────────────────────────────────────────────────────
// Derived token types — consumed by component prop interfaces
// ─────────────────────────────────────────────────────────────────
export type SpacingKey = keyof typeof spacing;
