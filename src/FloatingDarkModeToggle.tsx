'use client';

import { useTheme } from '@mui/material/styles';
import { ColorMode, useColorMode } from './ColorModeContext';
import { LightFilledIcon, MoonFilledIcon } from './icons';
import { ToggleLabel, TogglePill } from './FloatingDarkModeToggle.styles';

export interface FloatingDarkModeToggleProps {
  onColorModeChange?: (colorMode: ColorMode) => void;
}

export default function FloatingDarkModeToggle({ onColorModeChange }: FloatingDarkModeToggleProps) {
  const theme = useTheme();
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <TogglePill
      component="button"
      onClick={() => {
        const nextColorMode = isDark ? 'light' : 'dark';
        setColorMode(nextColorMode);
        onColorModeChange?.(nextColorMode);
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <MoonFilledIcon size={15} color={theme.colors.yellow[400]} />
      ) : (
        <LightFilledIcon size={15} color={theme.semantic.primary.main} />
      )}
      <ToggleLabel component="span">
        {isDark ? 'Dark' : 'Light'}
      </ToggleLabel>
    </TogglePill>
  );
}
