/**
 * iOS Corner Smoothing (Continuous Curvature / Squircle)
 *
 * Standard CSS border-radius uses circular arcs. iOS/Apple uses "continuous
 * curvature" corners where the curvature builds up gradually from the straight
 * edge — visually softer and more organic at every scale.
 *
 * Algorithm derivation:
 *   - For corner radius r and smoothing s, the curve starts at distance
 *     p = r*(1+s) from the corner along each edge (vs. r for a circle).
 *   - Bezier control handles are placed so the midpoint of the curve passes
 *     through the same point as a circular arc of radius r — preserving the
 *     "visual size" of the corner while changing its shape.
 *   - At s=0 the formula reduces exactly to the standard border-radius bezier
 *     (handle = r × 0.5523), confirming correctness.
 *
 * Usage:
 *   import { getSquirclePath, CORNER_SMOOTHING } from '@/app/lib/squircle';
 *   const path = getSquirclePath(width, height, cornerRadius);
 *   // Apply via: sx={{ clipPath: `path('${path}')` }}
 */

/** Apple's iOS/macOS corner smoothing value. */
export const CORNER_SMOOTHING = 0.6;

/**
 * Generates an SVG path string for a rectangle with continuous-curvature
 * (squircle) corners. Apply as `clip-path: path('...')` in CSS.
 *
 * `clip-path: path()` uses the element's local coordinate system, so no
 * ResizeObserver acrobatics are needed — just re-run whenever dimensions change.
 *
 * @param width          — element width in px
 * @param height         — element height in px
 * @param cornerRadius   — desired corner radius in px
 * @param smoothing      — 0 = standard circle, 0.6 = iOS (default), 1 = maximum
 * @param expand         — expand path outward by this many px on each side (default 0).
 *                         Use a small positive value (e.g. 2) so 1px borders on the
 *                         element are not anti-aliased by the clip-path edge.
 * @returns SVG path data
 */
export function getSquirclePath(
  width: number,
  height: number,
  cornerRadius: number,
  smoothing: number = CORNER_SMOOTHING,
  expand: number = 0
): string {
  // Clamp radius to fit within the element without overlap
  const r = Math.min(cornerRadius, width / 2, height / 2);
  const e = expand / 2; // outward offset per side

  if (r <= 0) return `M ${-e} ${-e} H ${width + e} V ${height + e} H ${-e} Z`;

  const s = Math.min(Math.max(smoothing, 0), 1);

  // p: how far from each corner the curve starts.
  //    Standard border-radius: p = r.  Squircle: p = r*(1+s), clamped.
  const p = Math.min(r * (1 + s), Math.min(width, height) / 2);

  // rAdj: effective radius after clamping (may differ from r near min-dimension)
  const rAdj = p / (1 + s);

  // h: bezier handle length.
  //    Derived so the curve midpoint coincides with the equivalent circular arc
  //    at radius rAdj, ensuring the "visual corner size" is preserved.
  //    At s=0: h = rAdj*0.5523 (standard bezier for a circular arc) ✓
  const h = (rAdj * (0.207 + 0.5 * s)) / 0.375;

  const W = width;
  const H = height;

  // Each corner entry/exit point shifts outward by e along its respective edges.
  // Control-point handle length h is unchanged (preserves corner shape and size).
  return [
    `M ${p - e} ${-e}`,
    `L ${W - p + e} ${-e}`,
    `C ${W - p + e + h} ${-e} ${W + e} ${p - e - h} ${W + e} ${p - e}`, // top-right
    `L ${W + e} ${H - p + e}`,
    `C ${W + e} ${H - p + e + h} ${W - p + e + h} ${H + e} ${W - p + e} ${H + e}`, // bottom-right
    `L ${p - e} ${H + e}`,
    `C ${p - e - h} ${H + e} ${-e} ${H - p + e + h} ${-e} ${H - p + e}`, // bottom-left
    `L ${-e} ${p - e}`,
    `C ${-e} ${p - e - h} ${p - e - h} ${-e} ${p - e} ${-e}`, // top-left
    'Z',
  ].join(' ');
}

/**
 * Parses a border-radius token string (e.g. '12px') to a number.
 * Returns 0 for 'none', a large number for 'full' (handled by clamp in path gen).
 */
export function parseRadius(token: string | undefined | null): number {
  if (!token || token === 'none') return 0;
  if (token === '9999px') return 9999;
  return parseInt(token, 10) || 0;
}
