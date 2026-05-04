'use client';

/**
 * ColorModeContext — Global dark/light mode state.
 *
 * Provides:
 *   colorMode    — 'light' | 'dark'
 *   toggleColorMode() — flips mode and persists to localStorage
 *   setColorMode(mode) — sets a specific mode
 *
 * The provider sets `data-color-mode` on <html> so CSS variables switch automatically.
 * localStorage key: 'sc-color-mode'
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  colorMode: 'light',
  toggleColorMode: () => {},
  setColorMode: () => {},
});

const STORAGE_KEY = 'sc-color-mode';

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorModeState] = useState<ColorMode>('light');

  // Read preference on mount: URL param > localStorage.
  // URL param takes priority so sandbox iframes aren't affected by the shell's mode.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get('colorMode') as ColorMode | null;
      if (urlMode === 'dark' || urlMode === 'light') {
        setColorModeState(urlMode);
        document.documentElement.setAttribute('data-color-mode', urlMode);
        return; // URL param wins — don't read localStorage
      }
      const stored = localStorage.getItem(STORAGE_KEY) as ColorMode | null;
      if (stored === 'dark' || stored === 'light') {
        setColorModeState(stored);
        document.documentElement.setAttribute('data-color-mode', stored);
      }
    } catch {
      // localStorage not available (SSR, etc.)
    }
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    document.documentElement.setAttribute('data-color-mode', mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // localStorage not available
    }
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  }, [colorMode, setColorMode]);

  const value = useMemo(
    () => ({ colorMode, toggleColorMode, setColorMode }),
    [colorMode, toggleColorMode, setColorMode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

/** Hook to access color mode state and toggle. */
export function useColorMode(): ColorModeContextValue {
  return useContext(ColorModeContext);
}

export default ColorModeContext;
