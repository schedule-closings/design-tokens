'use client';

/**
 * CustomMap — Interactive map with custom markers and popups
 *
 * Loads react-leaflet after mount (SSR-safe). Supports:
 *   - LocationMarkerPin as the default marker (color-coded by access type)
 *   - LocationPeekCard as the default popup (firm details)
 *   - Custom React component markers via `icon`/`popup` overrides
 *   - CSS filter theming via --sc-map-* CSS variables (applied to tile pane only,
 *     so markers remain unaffected)
 *
 * When a marker has `name` and `accessType` but no custom `icon`, the map
 * automatically renders a LocationMarkerPin. When no custom `popup` is provided,
 * a LocationPeekCard is rendered using the marker's data fields.
 *
 * @see CustomMapInner.tsx for the actual implementation
 */

import React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { AccessType } from './LocationMarkerPin';
import {
  SkeletonRoot,
  SkeletonShimmer,
  SkeletonHRoad,
  SkeletonVRoad,
  SkeletonDiagonalRoad,
  SkeletonBlock,
  SkeletonZoomControls,
  SkeletonZoomBtnTop,
  SkeletonZoomBtnBottom,
  SkeletonZoomBar,
  SkeletonAttribution,
  SkeletonAttributionBar,
} from './CustomMap.styles';

// ---------------------------------------------------------------------------
// Types (exported for use by consumers and CustomMapInner)
// ---------------------------------------------------------------------------

export interface MapMarker {
  /** Latitude for this marker */
  lat: number;
  /** Longitude for this marker */
  lng: number;
  /** Unique key for React reconciliation */
  id?: string;

  // ── LocationMarkerPin data (used when no custom icon is provided) ──────
  /** CSP / firm display name — drives default LocationMarkerPin */
  name?: string;
  /** Access type for color coding: blue (live) or yellow (standalone) */
  accessType?: AccessType;
  /** Whether this marker is in active/selected state */
  active?: boolean;
  /** When true, renders the pin in grayscale (another marker is selected) */
  muted?: boolean;
  /** When true, this office belongs to the selected CSP but is not the selected office */
  dimmed?: boolean;
  /** Optional logo image URL for the pin */
  logoUrl?: string;
  /** Rating value for the peek card (e.g. 4.7) */
  rating?: number;
  /** Number of reviews for the peek card */
  reviewCount?: number;
  /** Office / branch name for the peek card */
  officeName?: string;
  /** Distance from property address (e.g. "2.5 mi") */
  distance?: string;
  /** Address string for the peek card */
  address?: string;

  // ── Custom overrides ───────────────────────────────────────────────────
  /** Custom z-index offset override for this marker */
  zIndexOffset?: number;
  /** Custom React component rendered as the marker icon (overrides default pin) */
  icon?: React.ReactNode;
  /** Custom React component rendered inside the popup (overrides default peek card) */
  popup?: React.ReactNode;
}

export interface CustomMapProps {
  /** Latitude for the map center */
  lat: number;
  /** Longitude for the map center */
  lng: number;
  /** Increment to force recenter even when lat/lng are unchanged */
  recenterKey?: number;
  /** When set, overrides the current zoom level on next recenter */
  recenterZoom?: number;
  /**
   * Optional override for the on-map "Recenter" button. When provided, clicking
   * the recenter button snaps to these coordinates instead of the current
   * lat/lng. Used to send the user back to their geolocation (or the
   * fallback) regardless of address pin / office state.
   */
  recenterTarget?: { lat: number; lng: number; zoom?: number };
  /** Fires when the map's viewport changes (manual pan, zoom, programmatic recenter). Receives the new center + zoom. Use to react to "the map is now showing X area" — e.g. restoring a list when the user pans back into a supported region. */
  onViewportChange?: (center: { lat: number; lng: number; zoom: number }) => void;
  /** Leaflet zoom level (default 13) */
  zoom?: number;
  /** Map container height in px (default 280) */
  height?: number | string;
  /** Border radius token (default borderRadius.lg) */
  borderRadius?: string;
  /** Show default marker pin at center (default true) */
  marker?: boolean;
  /** Array of custom markers with optional icons and popups */
  markers?: MapMarker[];
  /** Callback fired when a custom marker is clicked */
  onMarkerClick?: (marker: MapMarker) => void;
  /** Callback fired when the map background is clicked (not a marker). Receives { lat, lng }. */
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  /** When true, shows crosshair cursor on the map (for pin placement mode) */
  placePinMode?: boolean;
  /** Callback to toggle place-pin mode (fired by the map's pin button) */
  onTogglePlacePin?: () => void;
  /** Enable zoom and pan interaction (default true) */
  interactive?: boolean;
  /** Optional radius circle overlay: { lat, lng, radiusMiles, color? } */
  radiusCircle?: { lat: number; lng: number; radiusMiles: number; color?: string };
  /** MUI sx overrides on the outer container */
  sx?: SxProps<Theme>;
}

// ---------------------------------------------------------------------------
// Client-only lazy import (SSR-safe)
// ---------------------------------------------------------------------------

/**
 * MapSkeleton — mimics the map layout with placeholder "roads", "blocks",
 * zoom controls, and an attribution bar so users recognize it as a loading map.
 */
function MapSkeleton() {
  return (
    <SkeletonRoot>
      {/* Shimmer overlay */}
      <SkeletonShimmer />

      {/* Fake map grid — horizontal roads */}
      {[18, 35, 55, 78].map((top) => (
        <SkeletonHRoad key={`h-${top}`} style={{ top: `${top}%` }} />
      ))}

      {/* Vertical roads */}
      {[22, 45, 68, 85].map((left) => (
        <SkeletonVRoad key={`v-${left}`} style={{ left: `${left}%` }} />
      ))}

      {/* Diagonal road */}
      <SkeletonDiagonalRoad />

      {/* City blocks */}
      {[
        { top: '20%', left: '24%', w: '18%', h: '13%' },
        { top: '40%', left: '47%', w: '16%', h: '12%' },
        { top: '60%', left: '10%', w: '10%', h: '15%' },
        { top: '22%', left: '70%', w: '12%', h: '10%' },
        { top: '58%', left: '70%', w: '14%', h: '18%' },
      ].map((b, i) => (
        <SkeletonBlock
          key={`b-${i}`}
          style={{ top: b.top, left: b.left, width: b.w, height: b.h }}
        />
      ))}

      {/* Zoom controls placeholder (top-left) */}
      <SkeletonZoomControls>
        <SkeletonZoomBtnTop>
          <SkeletonZoomBar />
        </SkeletonZoomBtnTop>
        <SkeletonZoomBtnBottom>
          <SkeletonZoomBar />
        </SkeletonZoomBtnBottom>
      </SkeletonZoomControls>

      {/* Attribution bar placeholder (bottom-right) */}
      <SkeletonAttribution>
        <SkeletonAttributionBar />
      </SkeletonAttribution>
    </SkeletonRoot>
  );
}

const CustomMapInner = React.lazy(() => import('./CustomMapInner'));

function CustomMap(props: CustomMapProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <MapSkeleton />;
  }

  return (
    <React.Suspense fallback={<MapSkeleton />}>
      <CustomMapInner {...props} />
    </React.Suspense>
  );
}

export default CustomMap;
