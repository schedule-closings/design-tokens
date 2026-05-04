'use client';

/**
 * Toast --- SV Design System toast notification message.
 * Source: Figma file OVjygxh5hpVujmD1gl4MB9, node 3824-5048
 *
 * Props:
 *   type     --- 'success'|'error'|'warning'|'info'  default: 'success'
 *   message  --- string    --- notification text (wraps to multiple lines as needed)
 *   onClose  --- func      --- () => void --- dismiss callback
 *   sx       --- SxProps   --- overrides on the outer container
 *
 * ------ Dark Mode: Opaque Tinted Backgrounds ------
 *
 * Floating elements (toasts, popovers, dropdowns) that overlay page content
 * MUST use opaque backgrounds --- never translucent ones. In dark mode, we
 * achieve tinted-but-opaque backgrounds by mixing the accent color with the
 * dark surface color instead of `transparent`:
 *
 *   --- color-mix(in srgb, green[500] 10%, slate[900])  --- opaque, nothing shows through
 *   --- color-mix(in srgb, green[500] 10%, transparent)  --- translucent, content bleeds through
 *   --- rgba(34,197,94,0.1)                               --- same problem as transparent mix
 *
 * Use this pattern for any dark-mode element that floats above other content:
 *   - Toast notifications
 *   - Dropdown menus / popovers
 *   - Floating action panels
 *   - Tooltip backgrounds (if custom-colored)
 *
 * For non-floating elements (inline cards, table cells, calendar day cells),
 * translucent `color-mix(..., transparent)` is fine because they sit within
 * the page flow and don't overlap other content.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import SmoothBox from './SmoothBox';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import {
  CheckmarkFilledIcon,
  WarningFilledIcon,
  AlertFilledIcon,
  InformationFilledIcon,
  CloseIcon,
} from './icons';
import { IconProps } from './icons';
import Spinner from './Spinner';
import { ToastIconBox, ToastMessageText, ToastCloseButton } from './Toast.styles';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface ToastProps {
  /** Semantic variant. `'neutral'` is typically paired with `spinner` for loading/progress toasts. */
  type?: ToastType;
  message?: string;
  /** Controls visibility. When true, shows the toast; auto-dismisses after `duration` ms. */
  open?: boolean;
  onClose?: () => void;
  /** Auto-dismiss duration in ms. Default: 4000. Set to 0 to disable (ideal for spinner toasts that end on navigation). */
  duration?: number;
  /**
   * When true, renders a Spinner in place of the type icon and hides the close
   * button --- the toast is assumed to unmount when the awaited work finishes
   * (e.g. a page transition). Pair with `duration={0}`.
   */
  spinner?: boolean;
  sx?: SxProps<Theme>;
}

// Type config

interface ToastTypeConfig {
  bg: string;
  border: string;
  text: string;
  iconColor: string;
  Icon: React.FC<IconProps>;
  label: string;
  darkBg: string;
  darkBorder: string;
  darkText: string;
}

function getTypeConfig(theme: Theme): Record<ToastType, ToastTypeConfig> {
  return {
    success: {
      bg: theme.colors.green[50],
      border: theme.semantic.success.light,
      text: theme.semantic.success.dark,
      iconColor: theme.semantic.success.main,
      Icon: CheckmarkFilledIcon,
      label: 'Success',
      darkBg: `color-mix(in srgb, ${theme.colors.green[500]} 10%, ${theme.colors.slate[900]})`,
      darkBorder: `color-mix(in srgb, ${theme.colors.green[500]} 25%, ${theme.colors.slate[800]})`,
      darkText: theme.colors.green[300],
    },
    error: {
      bg: theme.colors.red[50],
      border: theme.semantic.error.light,
      text: theme.semantic.error.dark,
      iconColor: theme.semantic.error.main,
      Icon: WarningFilledIcon,
      label: 'Error',
      darkBg: `color-mix(in srgb, ${theme.colors.red[500]} 10%, ${theme.colors.slate[900]})`,
      darkBorder: `color-mix(in srgb, ${theme.colors.red[500]} 25%, ${theme.colors.slate[800]})`,
      darkText: theme.colors.red[300],
    },
    warning: {
      bg: theme.colors.yellow[50],
      border: theme.semantic.alert.light,
      text: theme.semantic.alert.dark,
      iconColor: theme.semantic.alert.main,
      Icon: AlertFilledIcon,
      label: 'Warning',
      darkBg: `color-mix(in srgb, ${theme.colors.yellow[500]} 10%, ${theme.colors.slate[900]})`,
      darkBorder: `color-mix(in srgb, ${theme.colors.yellow[500]} 25%, ${theme.colors.slate[800]})`,
      darkText: theme.colors.yellow[300],
    },
    info: {
      bg: theme.colors.blue[50],
      border: theme.semantic.primary.light,
      text: theme.semantic.primary.dark,
      iconColor: theme.semantic.primary.main,
      Icon: InformationFilledIcon,
      label: 'Info',
      darkBg: `color-mix(in srgb, ${theme.colors.blue[500]} 10%, ${theme.colors.slate[900]})`,
      darkBorder: `color-mix(in srgb, ${theme.colors.blue[500]} 25%, ${theme.colors.slate[800]})`,
      darkText: theme.colors.blue[300],
    },
    neutral: {
      bg: theme.colors.slate[50],
      border: theme.semantic.divider,
      text: theme.semantic.text.primary,
      iconColor: theme.semantic.text.secondary,
      Icon: InformationFilledIcon,
      label: 'Loading',
      darkBg: theme.colors.slate[900],
      darkBorder: `color-mix(in srgb, ${theme.colors.slate[400]} 25%, ${theme.colors.slate[800]})`,
      darkText: theme.colors.slate[100],
    },
  };
}

// Component

export default function Toast({ type = 'success', message, open, onClose, duration = 4000, spinner = false, sx }: ToastProps) {
  const theme = useTheme();
  const TYPE_CONFIG = getTypeConfig(theme);
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.success;
  const { Icon } = cfg;

  const isControlled = open !== undefined;
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const EXIT_MS = 300; // matches toastExit animation duration

  const handleDismiss = useCallback(() => {
    if (dismissing) return;
    setDismissing(true);
    setTimeout(() => {
      setDismissing(false);
      setVisible(false);
      onClose?.();
    }, EXIT_MS);
  }, [dismissing, onClose]);

  // Sync visible state with open prop
  useEffect(() => {
    if (open) { setVisible(true); setDismissing(false); }
    else if (visible && !dismissing) { handleDismiss(); }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-dismiss after duration --- use a stable ref to avoid timer resets
  const handleDismissRef = useRef(handleDismiss);
  handleDismissRef.current = handleDismiss;

  useEffect(() => {
    if (!visible || dismissing || !duration) return;
    const timer = setTimeout(() => handleDismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [visible, dismissing, duration]);

  if (isControlled && !visible) return null;

  return (
    <SmoothBox
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      smoothRadius={theme.customBorderRadius.xl}
      sx={{
        // When controlled (open prop), float fixed
        ...(isControlled && {
          position: 'fixed',
          zIndex: 1400,
          top: theme.customSpacing[4],
          // Mobile: full-width, top-center, slide from top
          left: theme.customSpacing[5],
          right: theme.customSpacing[5],
          maxWidth: 'none',
          animation: dismissing
            ? `toastExitMobile ${EXIT_MS}ms ease-in forwards`
            : 'toastEnterMobile 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '@keyframes toastEnterMobile': {
            '0%': { opacity: 0, transform: 'translateY(-40px) scale(0.95)' },
            '60%': { opacity: 1, transform: 'translateY(4px) scale(1.01)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          },
          '@keyframes toastExitMobile': {
            '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
            '100%': { opacity: 0, transform: 'translateY(-40px) scale(0.95)' },
          },
          // Tablet+: top-right, slide from right (original behavior)
          '@media (min-width: 750px)': {
            left: 'auto',
            right: theme.customSpacing[4],
            maxWidth: 420,
            width: 'auto',
            animation: dismissing
              ? `toastExit ${EXIT_MS}ms ease-in forwards`
              : 'toastEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          },
          '@keyframes toastEnter': {
            '0%': { opacity: 0, transform: 'translateX(40px) scale(0.95)' },
            '60%': { opacity: 1, transform: 'translateX(-4px) scale(1.01)' },
            '100%': { opacity: 1, transform: 'translateX(0) scale(1)' },
          },
          '@keyframes toastExit': {
            '0%': { opacity: 1, transform: 'translateX(0) scale(1)' },
            '100%': { opacity: 0, transform: 'translateX(40px) scale(0.95)' },
          },
        }),
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.customSpacing[3],
        padding: theme.customSpacing[4],
        border: `1px solid ${cfg.border}`,
        bgcolor: cfg.bg,
        boxShadow: `${theme.customShadows.lg}, ${theme.customShadows.xl}`,
        '[data-color-mode="dark"] &': {
          bgcolor: cfg.darkBg,
          borderColor: cfg.darkBorder,
          boxShadow: '0 2px 4px rgba(0,0,0,0.3), 0 6px 16px rgba(0,0,0,0.35), 0 16px 32px rgba(0,0,0,0.3), 0 32px 64px rgba(0,0,0,0.25)',
        },
        ...sx,
      }}
    >
      {/* Type icon --- or Spinner when loading */}
      <ToastIconBox aria-hidden={spinner ? undefined : 'true'}>
        {spinner ? (
          <Spinner size={24} color={cfg.iconColor} />
        ) : (
          <Icon size={24} color={cfg.iconColor} />
        )}
      </ToastIconBox>

      {/* Message */}
      <ToastMessageText
        style={{ color: cfg.text }}
        darkColor={cfg.darkText}
      >
        {message}
      </ToastMessageText>

      {/* Close button --- hidden while loading so users don't dismiss mid-transition */}
      {!spinner && (
        <ToastCloseButton
          component="button"
          aria-label="Dismiss notification"
          onClick={isControlled ? handleDismiss : onClose}
          focusBorderColor={cfg.border}
        >
          <CloseIcon size={24} color={cfg.text} />
        </ToastCloseButton>
      )}
    </SmoothBox>
  );
}
