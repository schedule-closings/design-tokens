'use client';

/**
 * useDropdownPlacement
 *
 * Shared viewport-aware placement logic for every field dropdown/popover in the
 * design system (SelectField, MultiselectField, ComboField,
 * LocationSuggestionField, TagSelectField, DatePickerField, etc.).
 *
 * Behavior:
 *   - Prefers opening below the anchor.
 *   - Flips above when the space below is less than `minSpace` AND there is
 *     more room above than below.
 *   - Returns a `maxHeight` (px) capped at the smaller of `maxHeight` and the
 *     available space on the chosen side, minus `gap` padding. Consumers pair
 *     this with `overflowY: 'auto'` on the scrollable container.
 *   - Recomputes on resize and on scroll events anywhere on the page so the
 *     dropdown stays correctly positioned while the popover is open.
 *
 * Consumers pass the `open` flag so measurement only runs while the popover
 * is visible — avoids layout work when the dropdown is closed.
 *
 * Follows floating-element best practices (see Floating UI `size` +
 * `flip` middleware). Kept lightweight — no external dependency.
 */

import { useEffect, useState } from 'react';

export interface DropdownPlacement {
  /** Which side of the anchor the dropdown should open on. */
  placement: 'bottom' | 'top';
  /** Max height in px the scroll container should apply. */
  maxHeight: number;
}

export interface UseDropdownPlacementOptions {
  /** Whether the dropdown is currently open. Skips measurement when false. */
  open: boolean;
  /** Gap (px) between anchor edge and the viewport edge / dropdown. Default: 8. */
  gap?: number;
  /**
   * Minimum space (px) required below the anchor before we consider flipping
   * to above. Default: 160 — roughly four 40px rows.
   */
  minSpace?: number;
  /**
   * Absolute max height cap (px) regardless of available viewport space.
   * Default: 360 — common select dropdown ceiling (~9 rows of 40px).
   */
  maxHeight?: number;
  /**
   * Min floor for the scrollable container when space is cramped. Ensures the
   * dropdown is always usable even near the viewport edge. Default: 120.
   */
  minHeight?: number;
}

const INITIAL: DropdownPlacement = { placement: 'bottom', maxHeight: 360 };

export function useDropdownPlacement(
  anchorEl: HTMLElement | null,
  options: UseDropdownPlacementOptions,
): DropdownPlacement {
  const {
    open,
    gap = 8,
    minSpace = 160,
    maxHeight = 360,
    minHeight = 120,
  } = options;

  const [state, setState] = useState<DropdownPlacement>({
    placement: 'bottom',
    maxHeight,
  });

  useEffect(() => {
    if (!open || !anchorEl || typeof window === 'undefined') return;

    const measure = () => {
      const rect = anchorEl.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;

      let nextPlacement: 'bottom' | 'top' = 'bottom';
      let available = spaceBelow;
      if (spaceBelow < minSpace && spaceAbove > spaceBelow) {
        nextPlacement = 'top';
        available = spaceAbove;
      }

      const nextMaxHeight = Math.max(minHeight, Math.min(maxHeight, available));

      setState((prev) =>
        prev.placement === nextPlacement && prev.maxHeight === nextMaxHeight
          ? prev
          : { placement: nextPlacement, maxHeight: nextMaxHeight },
      );
    };

    measure();
    window.addEventListener('resize', measure);
    // Capture phase so we catch scroll events from any scroll container on the page.
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, anchorEl, gap, minSpace, maxHeight, minHeight]);

  // Reset to defaults when closed so the next open starts fresh (prevents flash
  // of stale placement from a previous open on a different scroll position).
  useEffect(() => {
    if (!open) setState({ placement: 'bottom', maxHeight });
  }, [open, maxHeight]);

  return state;
}

export { INITIAL as DROPDOWN_PLACEMENT_DEFAULT };
