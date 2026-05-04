'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the effective `data-color-mode` for the closest ancestor of `anchorEl`.
 *
 * Why: some surfaces (DSExampleBlock in the design system previews) scope
 * `data-color-mode="dark"` on a local wrapper div instead of `<html>`. MUI
 * Popover/Menu portals render to `document.body`, outside that scope, so their
 * CSS custom properties (`--sc-*`) fall back to the html-level mode and visually
 * desync from the anchor. This hook reads the anchor's inherited mode whenever
 * the popover opens (and on DOM mutations while open) so the popover Paper can
 * carry the same `data-color-mode` attribute and CSS vars resolve correctly.
 */
export function useInheritedColorMode(
  anchorEl: Element | null | undefined,
  open: boolean,
): 'light' | 'dark' | undefined {
  const [mode, setMode] = useState<'light' | 'dark' | undefined>(undefined);

  useEffect(() => {
    if (!open || !anchorEl) return;

    function resolve(): 'light' | 'dark' | undefined {
      const ancestor = (anchorEl as Element).closest('[data-color-mode]');
      const value = ancestor?.getAttribute('data-color-mode');
      if (value === 'dark' || value === 'light') return value;
      const html = document.documentElement.getAttribute('data-color-mode');
      return html === 'dark' ? 'dark' : 'light';
    }

    setMode(resolve());

    // Watch for toggle changes on the nearest scoped ancestor.
    const target = (anchorEl as Element).closest('[data-color-mode]') ?? document.documentElement;
    const observer = new MutationObserver(() => setMode(resolve()));
    observer.observe(target, { attributes: true, attributeFilter: ['data-color-mode'] });
    return () => observer.disconnect();
  }, [anchorEl, open]);

  return mode;
}
