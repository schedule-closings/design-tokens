// app/components/StatePill.tsx
//
// StatePill --- tiny pill that displays a US state in one of three formats:
//
//   variant="name"            --- "New York"
//   variant="name-with-code"  --- "New York (NY)"   (code dimmed to text.secondary)
//   variant="code" (default)  --- "NY"              (tooltip on hover reveals full name)
//
// StatePillOverflow --- companion "+N" badge for when a list of states
// outgrows its column. Hover reveals a plain list (no avatars, no header)
// of every state formatted "New York (NY)" with the code + parentheses
// dimmed to match the name-with-code variant.
//
// The full state name is resolved from `app/lib/usStates.ts` when the
// consumer passes only a code. Consumers can also pass both (e.g. to
// display a state name that isn't in the canonical US list).
'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from './Tooltip';
import { US_STATES } from './usStates';
import {
  StatePillRoot,
  StatePillCodeMuted,
  StatePillOverflowRoot,
} from './StatePill.styles';

export type StatePillVariant = 'name' | 'name-with-code' | 'code';

export interface StatePillProps {
  /** Two-letter USPS code, e.g. "NY". Case-insensitive input is normalised to uppercase. */
  code: string;
  /** Full state name override. If omitted, resolved from US_STATES via `code`. */
  name?: string;
  /** Display format --- see file comment. Defaults to `'code'`. */
  variant?: StatePillVariant;
}

export default function StatePill({
  code,
  name,
  variant = 'code',
}: StatePillProps): React.ReactElement {
  const upperCode = code.toUpperCase();
  const fullName =
    name ?? US_STATES.find((s) => s.code === upperCode)?.name ?? upperCode;

  if (variant === 'name') {
    return <StatePillRoot component="span">{fullName}</StatePillRoot>;
  }

  if (variant === 'name-with-code') {
    return (
      <StatePillRoot component="span">
        {fullName} <StatePillCodeMuted>({upperCode})</StatePillCodeMuted>
      </StatePillRoot>
    );
  }

  // 'code' variant --- show only the abbreviation, with the full name on hover.
  return (
    <Tooltip title={fullName}>
      <StatePillRoot component="span" aria-label={fullName}>
        {upperCode}
      </StatePillRoot>
    </Tooltip>
  );
}

export interface StatePillOverflowProps {
  /**
   * State codes to list in the hover tooltip. Typically the FULL list of
   * states (visible + hidden) so the user can see everything the pill row
   * represents in one place.
   */
  codes: string[];
  /**
   * Visible "+N" label. When omitted, defaults to `codes.length`. Consumers
   * usually pass the OVERFLOW count --- the states that don't fit next to
   * the visible StatePill siblings --- not the total.
   */
  count?: number;
}

/**
 * Muted-code color used inside the overflow tooltip's dark background.
 * Tokens' `semantic.text.secondary` resolves to a dark-on-light gray which
 * disappears against the tooltip's black background, so we use a white-
 * alpha value instead --- enough opacity to read as secondary without
 * fading below WCAG comfort.
 */
const OVERFLOW_TOOLTIP_MUTED_COLOR = 'rgba(255, 255, 255, 0.6)';

/**
 * "+N" overflow badge paired with a plain text list tooltip. Use when a
 * state-chip row is truncated and you want to surface the remaining
 * (or full) list on hover.
 */
export function StatePillOverflow({
  codes,
  count,
}: StatePillOverflowProps): React.ReactElement {
  const displayCount = count ?? codes.length;
  const items = codes.map((rawCode) => {
    const code = rawCode.toUpperCase();
    const entry = US_STATES.find((s) => s.code === code);
    return { code, name: entry?.name ?? code };
  });

  const tooltipContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {items.map((item) => (
        <span key={item.code}>
          {item.name}{' '}
          <span style={{ color: OVERFLOW_TOOLTIP_MUTED_COLOR }}>
            ({item.code})
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <Tooltip title={tooltipContent}>
      <StatePillOverflowRoot
        component="span"
        aria-label={`${displayCount} more states`}
      >
        +{displayCount}
      </StatePillOverflowRoot>
    </Tooltip>
  );
}

export interface StatePillRowProps {
  /** Ordered list of state codes to render. */
  codes: string[];
}

const STATE_PILL_ROW_GAP = 4; // matches theme.customSpacing[1]

/**
 * StatePillRow --- flex row of StatePills that adapts to the available
 * width by reflowing overflow into a single trailing "+N" pill.
 *
 * Behavior:
 *
 *   - Renders the codes as left-to-right StatePills (`code` variant).
 *   - On mount and whenever the container resizes, measures each pill's
 *     intrinsic width and figures out the maximum prefix that fits
 *     WITHOUT clipping. States that don't fit collapse into a single
 *     `StatePillOverflow` pill whose count reflects the actual hidden
 *     number --- shrink the column and you'll see 3 pills, then 2, then 1,
 *     then just "+N".
 *   - The overflow pill always takes priority over individual states ---
 *     if only one thing can fit, it's the "+N" badge (with every state
 *     listed in its hover tooltip) so the full list stays one hover away.
 */
export function StatePillRow({ codes }: StatePillRowProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  // `pillWidths`: individual widths of each state pill in the same order as
  // `codes`. `overflowWidth`: width of the worst-case "+NN" badge. Both
  // populated from the hidden measurement row below.
  const [pillWidths, setPillWidths] = useState<number[] | null>(null);
  const [overflowWidth, setOverflowWidth] = useState<number>(0);
  // `visibleCount`: how many pills render in the visible row. Default to
  // the full set --- will be clamped down by the layout effect once widths
  // are known and the container width is measured.
  const [visibleCount, setVisibleCount] = useState<number>(codes.length);

  // Measure pill widths from the hidden row whenever the codes change.
  // Uses useLayoutEffect so the visible-count calculation below runs in
  // the same commit as the measurement --- no flash of wrongly-sized row.
  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    const children = Array.from(node.children) as HTMLElement[];
    if (children.length === 0) return;
    // Last child is the worst-case overflow badge; everything before is
    // one pill per code.
    const pills = children.slice(0, codes.length);
    const overflowEl = children[children.length - 1];
    setPillWidths(pills.map((el) => el.offsetWidth));
    setOverflowWidth(overflowEl?.offsetWidth ?? 0);
  }, [codes]);

  // Given the measured pill widths + the current container width, decide
  // how many pills fit. Re-runs whenever the container size changes via
  // ResizeObserver, so column-resize triggers a reflow.
  useEffect(() => {
    if (!pillWidths) return;
    const container = containerRef.current;
    if (!container) return;

    const compute = () => {
      const available = container.clientWidth;
      if (available <= 0 || pillWidths.length === 0) return;

      const gap = STATE_PILL_ROW_GAP;

      // First check: do ALL pills fit without any overflow?
      const totalAll = pillWidths.reduce(
        (sum, w, i) => sum + w + (i > 0 ? gap : 0),
        0,
      );
      if (totalAll <= available) {
        setVisibleCount(pillWidths.length);
        return;
      }

      // They don't all fit --- the overflow pill is going to render, so
      // reserve space for it. Then greedily fit pills from the left.
      const reservedForOverflow = overflowWidth + gap;
      let used = 0;
      let count = 0;
      for (let i = 0; i < pillWidths.length; i++) {
        const delta = pillWidths[i] + (i > 0 ? gap : 0);
        if (used + delta + reservedForOverflow > available) break;
        used += delta;
        count = i + 1;
      }
      setVisibleCount(count);
    };

    compute();

    // Observe container size changes so column-resize reflows the row.
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    return () => ro.disconnect();
  }, [pillWidths, overflowWidth]);

  const overflow = codes.length - visibleCount;
  const visibleCodes = overflow > 0 ? codes.slice(0, visibleCount) : codes;

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${STATE_PILL_ROW_GAP}px`,
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
        flexWrap: 'nowrap',
      }}
    >
      {/*
        Hidden measurement row --- renders every pill once at its natural
        width plus a worst-case "+NN" overflow badge so we can discover
        their exact widths. Positioned absolutely OUT of the visible
        container so it never affects layout.
      */}
      <Box
        ref={measureRef}
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${STATE_PILL_ROW_GAP}px`,
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      >
        {codes.map((code) => (
          <StatePill key={`m-${code}`} code={code} variant="code" />
        ))}
        {/* Worst-case overflow width (3 digits) so we never underestimate. */}
        <StatePillOverflow codes={[]} count={99} />
      </Box>

      {/* Visible row */}
      {visibleCodes.map((code) => (
        <StatePill key={code} code={code} variant="code" />
      ))}
      {overflow > 0 && (
        <StatePillOverflow codes={codes} count={overflow} />
      )}
    </Box>
  );
}
