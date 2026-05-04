'use client';

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useTheme } from '@mui/material/styles';
import BaseButton from './BaseButton';
import { CloseIcon } from './icons';
import {
  ActionsRow,
  CaptureTarget,
  CARET_SIZE,
  Caret,
  CloseButton,
  Description,
  HeaderRow,
  HintRow,
  OutlineRing,
  Overlay,
  POPOVER_WIDTH,
  PopoverCard,
  StepBadge,
  Title,
} from './Walkthrough.styles';

export interface WalkthroughStep {
  targetSelector: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

export interface WalkthroughProps {
  open: boolean;
  steps: WalkthroughStep[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  advanceMode?: 'next-button' | 'click-target';
  highlightMode?: 'dim-overlay' | 'outline-glow';
}

const ESTIMATED_HEIGHT = 220;
const HIGHLIGHT_PADDING = 8;
const CARET_GAP = 8;
const CARET_PROJECTION = Math.ceil(CARET_SIZE * Math.SQRT1_2);
const GAP = HIGHLIGHT_PADDING + CARET_GAP + CARET_PROJECTION;
const VIEWPORT_PADDING = 16;

type Side = 'top' | 'bottom' | 'left' | 'right';

function computePositionRaw(
  side: Side,
  rect: DOMRect,
  popoverWidth: number,
  popoverHeight: number,
): { top: number; left: number } {
  switch (side) {
    case 'right':
      return {
        top: rect.top + rect.height / 2 - popoverHeight / 2,
        left: rect.right + GAP,
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2 - popoverHeight / 2,
        left: rect.left - popoverWidth - GAP,
      };
    case 'top':
      return {
        top: rect.top - popoverHeight - GAP,
        left: rect.left + rect.width / 2 - popoverWidth / 2,
      };
    case 'bottom':
      return {
        top: rect.bottom + GAP,
        left: rect.left + rect.width / 2 - popoverWidth / 2,
      };
  }
}

function fitsInViewport(pos: { top: number; left: number }, popoverWidth: number, popoverHeight: number): boolean {
  return (
    pos.top >= VIEWPORT_PADDING &&
    pos.left >= VIEWPORT_PADDING &&
    pos.top + popoverHeight <= window.innerHeight - VIEWPORT_PADDING &&
    pos.left + popoverWidth <= window.innerWidth - VIEWPORT_PADDING
  );
}

function opposite(side: Side): Side {
  return side === 'right' ? 'left'
    : side === 'left' ? 'right'
      : side === 'top' ? 'bottom'
        : 'top';
}

function perpendiculars(side: Side): [Side, Side] {
  return side === 'right' || side === 'left' ? ['bottom', 'top'] : ['right', 'left'];
}

function resolvePlacement(
  requested: WalkthroughStep['placement'] | undefined,
  rect: DOMRect,
  popoverWidth: number,
  popoverHeight: number,
): Side {
  const preferred: Side = !requested || requested === 'auto' ? 'right' : requested;
  const [perp1, perp2] = perpendiculars(preferred);
  const candidates: Side[] = [preferred, opposite(preferred), perp1, perp2];

  for (const side of candidates) {
    const pos = computePositionRaw(side, rect, popoverWidth, popoverHeight);
    if (fitsInViewport(pos, popoverWidth, popoverHeight)) return side;
  }

  return preferred;
}

function clampToViewport(
  pos: { top: number; left: number },
  popoverWidth: number,
  popoverHeight: number,
): { top: number; left: number } {
  return {
    top: Math.max(
      VIEWPORT_PADDING,
      Math.min(pos.top, window.innerHeight - popoverHeight - VIEWPORT_PADDING),
    ),
    left: Math.max(
      VIEWPORT_PADDING,
      Math.min(pos.left, window.innerWidth - popoverWidth - VIEWPORT_PADDING),
    ),
  };
}

function caretSideFromPlacement(side: Side): Side {
  return opposite(side);
}

function computeCaretStyle(
  caretSide: Side,
  rect: DOMRect,
  popoverTop: number,
  popoverLeft: number,
  popoverWidth: number,
  popoverHeight: number,
): React.CSSProperties {
  const halfCaret = CARET_SIZE / 2;

  if (caretSide === 'left' || caretSide === 'right') {
    const rawTop = rect.top + rect.height / 2 - popoverTop - halfCaret;
    const clampedTop = Math.max(12, Math.min(rawTop, popoverHeight - CARET_SIZE - 12));
    return { top: clampedTop };
  }

  const rawLeft = rect.left + rect.width / 2 - popoverLeft - halfCaret;
  const clampedLeft = Math.max(12, Math.min(rawLeft, popoverWidth - CARET_SIZE - 12));
  return { left: clampedLeft };
}

export default function Walkthrough({
  open,
  steps,
  currentStep,
  onNext,
  onBack,
  onClose,
  advanceMode = 'next-button',
  highlightMode = 'dim-overlay',
}: WalkthroughProps): React.ReactElement | null {
  const step = steps[currentStep];
  const theme = useTheme();

  const [rect, setRect] = useState<DOMRect | null>(null);
  const [popoverHeight, setPopoverHeight] = useState<number>(ESTIMATED_HEIGHT);
  const [measured, setMeasured] = useState<boolean>(false);
  const [shaking, setShaking] = useState<boolean>(false);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const actionsRowRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const maskId = useId();

  useLayoutEffect(() => {
    setMeasured(false);
  }, [rect, currentStep]);

  useLayoutEffect(() => {
    if (!open || !step) return;

    let t: ReturnType<typeof setTimeout> | null = null;
    const measure = () => {
      const el = document.querySelector<HTMLElement>(
        `[data-walkthrough-id="${CSS.escape(step.targetSelector)}"]`,
      );
      setRect(el?.getBoundingClientRect() ?? null);
    };
    const schedule = () => {
      if (t) clearTimeout(t);
      t = setTimeout(measure, 100);
    };

    measure();
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);

    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
    };
  }, [open, step]);

  useLayoutEffect(() => {
    if (!open || !step || !rect) return;

    const node = popoverRef.current;
    if (!node) return;

    const measuredHeight = node.getBoundingClientRect().height;
    if (measuredHeight && Math.abs(measuredHeight - popoverHeight) > 0.5) {
      setPopoverHeight(measuredHeight);
    }
    if (measuredHeight) setMeasured(true);
  }, [open, step, rect, popoverHeight]);

  useEffect(() => {
    if (!open || !measured) return;

    const row = actionsRowRef.current;
    if (!row) return;

    const buttons = row.querySelectorAll<HTMLButtonElement>('button');
    const last = buttons[buttons.length - 1];
    last?.focus();
  }, [open, currentStep, measured]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || advanceMode !== 'next-button') return;

    const handler = (e: MouseEvent) => {
      const node = popoverRef.current;
      if (!node || node.contains(e.target as Node)) return;

      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      setShaking(true);
      shakeTimeoutRef.current = setTimeout(() => setShaking(false), 900);
    };

    document.addEventListener('click', handler, true);

    return () => {
      document.removeEventListener('click', handler, true);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    };
  }, [open, advanceMode]);

  useEffect(() => {
    if (!open || highlightMode !== 'dim-overlay') return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, highlightMode]);

  if (typeof document === 'undefined') return null;
  if (!open || !step) return null;

  const shouldShow = rect !== null;
  const placementSide = rect ? resolvePlacement(step.placement, rect, POPOVER_WIDTH, popoverHeight) : 'right';
  const rawPos = rect ? computePositionRaw(placementSide, rect, POPOVER_WIDTH, popoverHeight) : { top: 0, left: 0 };
  const { top, left } = rect ? clampToViewport(rawPos, POPOVER_WIDTH, popoverHeight) : rawPos;
  const caretSide = caretSideFromPlacement(placementSide);
  const caretStyle = rect ? computeCaretStyle(caretSide, rect, top, left, POPOVER_WIDTH, popoverHeight) : {};
  const isLastStep = currentStep === steps.length - 1;
  const showDimOverlay = highlightMode === 'dim-overlay';
  const showOutlineGlow = highlightMode === 'outline-glow';
  const glowRingColor = theme.semantic.primary.main;
  const glowShadowRest = `0 0 0 6px color-mix(in srgb, ${glowRingColor} 20%, transparent)`;
  const glowShadowPulse = `0 0 0 10px color-mix(in srgb, ${glowRingColor} 10%, transparent)`;
  const isClickTarget = advanceMode === 'click-target';
  const captureClickHandler = isClickTarget ? onNext : undefined;

  const content = (
    <>
      <GlobalStyles
        styles={{
          '@keyframes wt-fade-in': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          '@keyframes wt-shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '15%, 45%, 75%': { transform: 'translateX(-5px)' },
            '30%, 60%, 90%': { transform: 'translateX(5px)' },
          },
          '@keyframes wt-pulse': {
            '0%, 100%': { boxShadow: glowShadowRest },
            '50%': { boxShadow: glowShadowPulse },
          },
        }}
      />
      {shouldShow && showDimOverlay && rect && (
        <Overlay aria-hidden="true">
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <defs>
              <mask id={maskId}>
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={rect.left - HIGHLIGHT_PADDING}
                  y={rect.top - HIGHLIGHT_PADDING}
                  width={rect.width + HIGHLIGHT_PADDING * 2}
                  height={rect.height + HIGHLIGHT_PADDING * 2}
                  rx={12}
                  ry={12}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.5)"
              mask={`url(#${maskId})`}
            />
          </svg>
        </Overlay>
      )}
      {shouldShow && showOutlineGlow && rect && (
        <OutlineRing
          data-walkthrough-ring="true"
          aria-hidden="true"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            borderRadius: 12,
            outline: `2px solid ${glowRingColor}`,
            boxShadow: glowShadowRest,
          }}
        />
      )}
      {shouldShow && rect && (
        <CaptureTarget
          data-walkthrough-capture="true"
          role={isClickTarget ? 'button' : undefined}
          tabIndex={isClickTarget ? 0 : undefined}
          aria-label={isClickTarget ? 'Advance to next step' : undefined}
          onClick={captureClickHandler}
          onKeyDown={isClickTarget ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNext();
            }
          } : undefined}
          style={{
            top: rect.top - HIGHLIGHT_PADDING,
            left: rect.left - HIGHLIGHT_PADDING,
            width: rect.width + HIGHLIGHT_PADDING * 2,
            height: rect.height + HIGHLIGHT_PADDING * 2,
            borderRadius: 12,
            pointerEvents: 'auto',
            cursor: isClickTarget ? 'pointer' : 'default',
          }}
        />
      )}
      {shouldShow && (
        <PopoverCard
          ref={popoverRef}
          role="region"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          shaking={shaking}
          measured={measured}
          style={{ top, left }}
        >
          <Caret side={caretSide} style={caretStyle} />
          <HeaderRow>
            <StepBadge>
              {currentStep + 1}/{steps.length}
            </StepBadge>
            <CloseButton
              type="button"
              aria-label="Close walkthrough"
              onClick={onClose}
            >
              <CloseIcon size={20} color="currentColor" />
            </CloseButton>
          </HeaderRow>
          <Title id={titleId}>{step.title}</Title>
          <Description id={descriptionId}>{step.description}</Description>
          {isClickTarget ? (
            <HintRow>
              <TouchAppIcon sx={{ fontSize: 14 }} />
              Click the highlighted element to continue
            </HintRow>
          ) : null}
          <ActionsRow ref={actionsRowRef}>
            <BaseButton
              variant="ghost"
              color="neutral"
              size="small"
              onClick={onBack}
              disabled={currentStep === 0}
            >
              Back
            </BaseButton>
            {advanceMode === 'next-button' ? (
              <BaseButton
                variant="filled"
                color="primary"
                size="small"
                onClick={onNext}
              >
                {isLastStep ? 'Finish' : 'Next'}
              </BaseButton>
            ) : null}
          </ActionsRow>
        </PopoverCard>
      )}
    </>
  );

  return createPortal(content, document.body);
}
