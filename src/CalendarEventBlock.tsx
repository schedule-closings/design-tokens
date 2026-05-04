'use client';

import React, { useState, useRef, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import SmoothBox from './SmoothBox';
import ImagePlaceholder from './ImagePlaceholder';
import BaseButton from './BaseButton';
import { LocationFilledIcon, EventScheduleIcon, DocumentViewIcon } from './icons';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from './ColorModeContext';
import {
  type TransactionType,
  type EventType,
  type TransactionColorSet,
  getColors,
  WrapperRoot,
  PillRoot,
  PillText,
  PeekContainer,
  getPeekCardStyles,
  InfoRowRoot,
  InfoRowIconWrap,
  InfoRowText,
  AssignedRow,
  AssignedName,
  AssignedRole,
  PeekDivider,
  ActionsRow,
  PeekCaret,
  getActionButtonStyles,
} from './CalendarEventBlock.styles';

// Re-export types for external consumers
export type { TransactionType, EventType, TransactionColorSet };

export type EventTypeAlias = EventType;

export interface CalendarEventBlockProps {
  /** Time string displayed in pill, e.g. "8AM" or "9:30AM" */
  time: string;
  /** Address text, truncated in pill */
  address: string;
  /** Full date string for peek, e.g. "Thu, January 18, 2025 - 8:00AM" */
  dateLabel?: string;
  /** Transaction type determines the accent color */
  transactionType?: TransactionType;
  /** Label for transaction type shown in peek, e.g. "Purchase / Sale (Lending)" */
  transactionLabel?: string;
  /** Event type: internal (has transaction data) or external (plain event) */
  eventType?: EventType;
  /** Assigned person name (shown with avatar in peek) */
  assignedTo?: string;
  /** Assigned person role, e.g. "(Paralegal)" */
  assignedRole?: string;
  /** Whether to show the peek popover on hover */
  peek?: boolean;
  /** Optional click handler */
  onClick?: () => void;
  /** Callback when "View Transaction" is clicked */
  onViewTransaction?: () => void;
  /** Callback when "Open Transaction Chat" is clicked */
  onOpenChat?: () => void;
}

// Peek info row helper

interface InfoRowProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

function InfoRow({ icon, children }: InfoRowProps) {
  return (
    <InfoRowRoot>
      <InfoRowIconWrap>
        {icon}
      </InfoRowIconWrap>
      <InfoRowText>
        {children}
      </InfoRowText>
    </InfoRowRoot>
  );
}

// Main component

export default function CalendarEventBlock({
  time,
  address,
  dateLabel,
  transactionType = 'purchase-lending',
  transactionLabel,
  eventType = 'internal',
  assignedTo,
  assignedRole,
  peek = false,
  onClick,
  onViewTransaction,
  onOpenChat,
}: CalendarEventBlockProps) {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const [hovered, setHovered] = useState(false);
  const [fixedPos, setFixedPos] = useState<{ top: number; left: number; vertical: 'top' | 'bottom'; caretAlign: 'left' | 'center' | 'right' } | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Light mode + saturated dark-mode pills (handled by the color-mix
  // override inside PillRoot) come straight from getColors. The deeds
  // transaction is the lone exception: its slate-based palette doesn't
  // produce enough contrast through the dark color-mix, so we swap to
  // the design's solid gray spec here and tell PillRoot to skip its
  // dark-mode recolor.
  const isDark = colorMode === 'dark';
  const isDeedsDark = isDark && (transactionType === 'deeds' || eventType === 'external');
  const tc = isDeedsDark
    ? {
        // 40% gray/500 over the dark mica cell --- translucent fill that
        // lets the cell show through, matching the design spec.
        bg: `color-mix(in srgb, ${theme.colors.gray[500]} 40%, transparent)`,
        border: theme.colors.gray[500],
        text: theme.colors.gray[300],
      }
    : getColors(eventType, transactionType, theme);

  // Precompute style objects that require theme (for SmoothBox and BaseButton which need sx)
  const peekCardStyles = getPeekCardStyles(theme);
  const actionButtonStyles = getActionButtonStyles(theme);

  // Calculate fixed position for peek based on viewport bounds
  const computeFixedPosition = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const peekW = 493;
    const peekH = 320; // approximate height including caret
    const gap = 10;

    // Vertical: prefer below (caret points up), fall back to above (caret points down)
    const vertical: 'top' | 'bottom' = rect.bottom + peekH + gap < window.innerHeight ? 'bottom' : 'top';
    const top = vertical === 'bottom'
      ? rect.bottom + gap
      : rect.top - peekH - gap;

    // Horizontal: center on pill, shift to stay in viewport
    let left = rect.left + rect.width / 2 - peekW / 2;
    let caretAlign: 'left' | 'center' | 'right' = 'center';
    if (left + peekW > window.innerWidth - 16) {
      left = window.innerWidth - peekW - 16;
      caretAlign = 'right';
    }
    if (left < 16) {
      left = 16;
      caretAlign = 'left';
    }

    setFixedPos({ top, left, vertical, caretAlign });
  }, []);

  // Debounce hover to prevent flicker when moving between pill and peek
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    computeFixedPosition();
    setHovered(true);
  }, [computeFixedPosition]);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHovered(false);
    }, 150);
  }, []);

  const showPeek = peek && hovered;

  return (
    <WrapperRoot
      ref={wrapperRef}
      ownerHovered={hovered}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Compact pill */}
      <PillRoot
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e: React.KeyboardEvent) => {
          if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        ownerBg={tc.bg}
        ownerBorder={tc.border}
        ownerText={tc.text}
        ownerNoDarkRecolor={isDeedsDark}
      >
        <PillText ownerTextColor={tc.text} ownerNoDarkRecolor={isDeedsDark}>
          {time} - {address}
        </PillText>
      </PillRoot>

      {/* Peek popover */}
      {showPeek && fixedPos && (
        <PeekContainer
          ownerTop={fixedPos.top}
          ownerLeft={fixedPos.left}
          ownerCaretAlign={fixedPos.caretAlign}
          ownerVertical={fixedPos.vertical}
        >
          <SmoothBox
            smoothRadius={theme.customBorderRadius.xl}
            sx={peekCardStyles}
          >
          {/* Row 1 - Address */}
          <InfoRow
            icon={<LocationFilledIcon size={20} color={theme.semantic.text.secondary} />}
          >
            {address}
          </InfoRow>

          {/* Row 2 - Date/Time */}
          {dateLabel && (
            <InfoRow
              icon={<EventScheduleIcon size={20} color={theme.semantic.text.secondary} />}
            >
              {dateLabel}
            </InfoRow>
          )}

          {/* Row 3 - Transaction type */}
          {eventType === 'internal' && transactionLabel && (
            <InfoRow
              icon={<DocumentViewIcon size={20} color={theme.semantic.text.secondary} />}
            >
              {transactionLabel}
            </InfoRow>
          )}

          {/* Row 4 - Assigned */}
          {assignedTo && (
            <AssignedRow>
              <ImagePlaceholder
                placeholderType="Initials"
                name={assignedTo}
                size={24}
                shape="Circle"
              />
              <AssignedName>
                {assignedTo}
                {assignedRole && (
                  <AssignedRole component="span">
                    {assignedRole}
                  </AssignedRole>
                )}
              </AssignedName>
            </AssignedRow>
          )}

          {/* Divider + Action buttons */}
          {eventType === 'internal' && (
            <>
              <PeekDivider />

              <ActionsRow>
                <BaseButton
                  variant="ghost"
                  onClick={onViewTransaction}
                  sx={actionButtonStyles}
                >
                  View Transaction
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  onClick={onOpenChat}
                  sx={actionButtonStyles}
                >
                  Open Transaction Chat
                </BaseButton>
              </ActionsRow>
            </>
          )}
          </SmoothBox>

          {/* Caret/arrow --- inline SVG with two paths: a filled triangle
              that matches the card bg (covers the card's border line at
              the mouth), and a stroked open V (only the two outer
              diagonals, no top edge) that continues the card's border
              into the V tip. The dark-mode fill mixes 12% white over
              slate/900 so the caret tone matches the card's mica. */}
          <PeekCaret
            ownerVertical={fixedPos.vertical}
            ownerCaretAlign={fixedPos.caretAlign}
          >
            <svg
              width="16"
              height="8"
              viewBox="0 0 16 8"
              style={{ display: 'block' }}
              aria-hidden="true"
            >
              <path
                d="M0 0 L16 0 L8 8 Z"
                fill={
                  colorMode === 'dark'
                    ? `color-mix(in srgb, ${theme.colors.slate[900]} 88%, ${theme.colors.white} 12%)`
                    : theme.semantic.common.white
                }
              />
              <path
                d="M0 0 L8 8 L16 0"
                fill="none"
                stroke={theme.semantic.divider}
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PeekCaret>
        </PeekContainer>
      )}
    </WrapperRoot>
  );
}
