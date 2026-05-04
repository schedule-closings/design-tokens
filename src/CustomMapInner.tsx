'use client';

/**
 * CustomMapInner — React-Leaflet map with CSS filter theming
 *
 * This is the actual map implementation using react-leaflet.
 * It is dynamically imported by CustomMap.tsx with ssr: false.
 *
 * CSS filter theming targets ONLY the tile pane (.leaflet-tile-pane) so that
 * markers, popups, and other overlays remain crisp and unaffected.
 *
 * Active markers show a custom peek card overlay (not Leaflet Popup) that
 * repositions itself to stay within the map viewport.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';

import type { SxProps, Theme } from '@mui/material/styles';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import { LocationMarkerPin, LocationPeekCard } from './LocationMarkerPin';
import { TargetLocationIcon, PinFilledIcon } from './CustomMap.icons';
import type { AccessType } from './LocationMarkerPin';
import { MapRoot, PlacePinButton } from './CustomMapInner.styles';

// ---------------------------------------------------------------------------
// Types (mirrored from CustomMap.tsx to avoid circular import)
// ---------------------------------------------------------------------------
export interface MapMarker {
  lat: number;
  lng: number;
  id?: string;
  // LocationMarkerPin data fields
  name?: string;
  accessType?: AccessType;
  active?: boolean;
  muted?: boolean;
  dimmed?: boolean;
  logoUrl?: string;
  rating?: number;
  reviewCount?: number;
  officeName?: string;
  distance?: string;
  address?: string;
  /** Custom z-index offset override for this marker */
  zIndexOffset?: number;
  // Custom overrides
  icon?: React.ReactNode;
  popup?: React.ReactNode;
}

export interface CustomMapInnerProps {
  lat: number;
  lng: number;
  recenterKey?: number;
  recenterZoom?: number;
  recenterTarget?: { lat: number; lng: number; zoom?: number };
  onViewportChange?: (center: { lat: number; lng: number; zoom: number }) => void;
  zoom?: number;
  height?: number | string;
  borderRadius?: string;
  marker?: boolean;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  placePinMode?: boolean;
  onTogglePlacePin?: () => void;
  interactive?: boolean;
  radiusCircle?: { lat: number; lng: number; radiusMiles: number; color?: string };
  sx?: SxProps<Theme>;
}

// ---------------------------------------------------------------------------
// Leaflet default icon fix (bundler-safe CDN URLs)
// ---------------------------------------------------------------------------
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ---------------------------------------------------------------------------
// RecenterControl — Leaflet topleft button that snaps back to the property pin
// ---------------------------------------------------------------------------
function RecenterControl({ lat, lng, recenterTarget }: { lat: number; lng: number; recenterTarget?: { lat: number; lng: number; zoom?: number } }) {
  const map = useMap();
  const theme = useTheme();
  const [controlDiv, setControlDiv] = useState<HTMLDivElement | null>(null);

  // Resolve the recenter destination at click time so a freshly-arriving
  // geolocation (recenterTarget) is honored even after the control mounted.
  const targetLat = recenterTarget?.lat ?? lat;
  const targetLng = recenterTarget?.lng ?? lng;

  useEffect(() => {
    const RecenterCtrl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd() {
        const div = L.DomUtil.create('div', 'sc-recenter-control leaflet-bar');
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        setControlDiv(div);
        return div;
      },
      onRemove() {
        setControlDiv(null);
      },
    });

    const ctrl = new RecenterCtrl();
    ctrl.addTo(map);
    return () => { ctrl.remove(); };
  }, [map]);

  if (!controlDiv) return null;

  return createPortal(
    <a
      href="#"
      role="button"
      aria-label="Recenter map on property"
      title="Recenter"
      onClick={(e) => {
        e.preventDefault();
        // Preserve the user's current zoom — recenter only translates the
        // viewport to the reference location, never overrides their zoom.
        map.setView([targetLat, targetLng], map.getZoom());
      }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <TargetLocationIcon size={16} color={theme.semantic.text.secondary} />
    </a>,
    controlDiv
  );
}

// ---------------------------------------------------------------------------
// MapRecenter — re-centers the map when lat/lng props change
// ---------------------------------------------------------------------------
function MapRecenter({ lat, lng, zoom, recenterKey }: { lat: number; lng: number; zoom?: number; recenterKey?: number }) {
  const map = useMap();
  useEffect(() => {
    if (zoom != null) {
      map.setView([lat, lng], zoom);
    } else {
      map.setView([lat, lng]);
    }
  }, [lat, lng, zoom, map, recenterKey]);
  return null;
}

// ---------------------------------------------------------------------------
// ViewportTracker — fires onViewportChange whenever the user pans / zooms /
// any map move ends. Lets the page react to manual viewport changes (e.g.
// user pans into a supported region and we want to restore a filtered list).
// ---------------------------------------------------------------------------
function ViewportTracker({ onViewportChange }: { onViewportChange?: (c: { lat: number; lng: number; zoom: number }) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!onViewportChange) return;
    const fire = () => {
      const c = map.getCenter();
      onViewportChange({ lat: c.lat, lng: c.lng, zoom: map.getZoom() });
    };
    map.on('moveend zoomend', fire);
    return () => { map.off('moveend zoomend', fire); };
  }, [map, onViewportChange]);
  return null;
}

// ---------------------------------------------------------------------------
// ZoomWatcher — toggles a CSS class on the map container based on zoom level
// so that pin shadows can be hidden when zoomed out and pins overlap.
// ---------------------------------------------------------------------------
const SHADOW_ZOOM_THRESHOLD = 10;

// ---------------------------------------------------------------------------
// MapClickHandler — calls onMapClick when map background is clicked
// ---------------------------------------------------------------------------
function MapClickHandler({ onMapClick }: { onMapClick?: (latlng: { lat: number; lng: number }) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!onMapClick) return;
    const handler = (e: L.LeafletMouseEvent) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on('click', handler);
    return () => { map.off('click', handler); };
  }, [map, onMapClick]);
  return null;
}

function ZoomWatcher() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const update = () => {
      const z = map.getZoom();
      if (z < SHADOW_ZOOM_THRESHOLD) {
        container.classList.add('sc-map-zoomed-out');
      } else {
        container.classList.remove('sc-map-zoomed-out');
      }
    };
    update();
    map.on('zoomend', update);
    return () => { map.off('zoomend', update); };
  }, [map]);
  return null;
}

// ---------------------------------------------------------------------------
// PeekOverlay — viewport-aware floating card for the active marker
//
// Converts the active marker's lat/lng to pixel position and places the
// peek card so it doesn't obscure the pin and stays within the map bounds.
// Hides when the pin is outside the visible viewport.
// ---------------------------------------------------------------------------
type Placement = 'top' | 'bottom' | 'left' | 'right';

const CARD_W = 280;
const CARD_H = 160;
const GAP = 8; // px gap between pin and card
const PIN_H = 58; // approximate pin height including caret + ground shadow

function PeekOverlay({ markers }: { markers?: MapMarker[] }) {
  const map = useMap();
  const theme = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardPos, setCardPos] = useState<{ left: number; top: number } | null>(null);
  const [visible, setVisible] = useState(false);
  // Use ref for card height to avoid triggering re-renders on measurement
  const cardHeightRef = useRef(CARD_H);

  const activeMarker = markers?.find((m) => m.active && (m.popup || (m.name && m.accessType)));

  const computePos = useCallback((h: number) => {
    if (!activeMarker) return null;

    const point = map.latLngToContainerPoint([activeMarker.lat, activeMarker.lng]);
    const size = map.getSize();
    const margin = 20;
    if (point.x < -margin || point.x > size.x + margin || point.y < -margin || point.y > size.y + margin) {
      return null;
    }

    const spaceTop = point.y - PIN_H;
    const spaceBottom = size.y - point.y;
    const spaceLeft = point.x;
    const spaceRight = size.x - point.x;

    let placement: Placement = 'top';
    if (spaceTop >= h + GAP) placement = 'top';
    else if (spaceBottom >= h + GAP) placement = 'bottom';
    else if (spaceRight >= CARD_W + GAP + 20) placement = 'right';
    else if (spaceLeft >= CARD_W + GAP + 20) placement = 'left';

    let left: number;
    let top: number;
    switch (placement) {
      case 'top':    left = point.x - CARD_W / 2;         top = point.y - PIN_H - GAP - h; break;
      case 'bottom': left = point.x - CARD_W / 2;         top = point.y + GAP;              break;
      case 'right':  left = point.x + GAP + 20;           top = point.y - h / 2;            break;
      case 'left':   left = point.x - CARD_W - GAP - 20;  top = point.y - h / 2;            break;
    }

    const padding = 8;
    left = Math.max(padding, Math.min(left, size.x - CARD_W - padding));
    top  = Math.max(padding, Math.min(top,  size.y - h       - padding));
    return { left, top };
  }, [activeMarker, map]);

  const update = useCallback(() => {
    const pos = computePos(cardHeightRef.current);
    if (!pos) { setVisible(false); return; }
    setCardPos(pos);
    setVisible(true);
  }, [computePos]);

  // Measure card height into a ref — no state update, no extra render cycle
  useEffect(() => {
    if (cardRef.current && visible) {
      const h = cardRef.current.offsetHeight;
      if (h > 0 && h !== cardHeightRef.current) {
        cardHeightRef.current = h;
        const pos = computePos(h);
        if (pos) setCardPos(pos);
      }
    }
  });

  useEffect(() => {
    update();
    map.on('move zoom moveend zoomend', update);
    return () => { map.off('move zoom moveend zoomend', update); };
  }, [map, update]);

  const peekContent = activeMarker?.popup ?? (activeMarker?.name && activeMarker?.accessType ? (
    <LocationPeekCard
      name={activeMarker.name}
      accessType={activeMarker.accessType}
      logoUrl={activeMarker.logoUrl}
      officeName={activeMarker.officeName}
      distance={activeMarker.distance}
      rating={activeMarker.rating}
      reviewCount={activeMarker.reviewCount}
      address={activeMarker.address}
    />
  ) : null);

  return (
    <AnimatePresence>
      {visible && cardPos && peekContent && (
        <motion.div
          key={activeMarker?.id ?? 'peek'}
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.97, left: cardPos.left, top: cardPos.top }}
          animate={{ opacity: 1, scale: 1, left: cardPos.left, top: cardPos.top }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{
            opacity: { duration: 0.12, ease: 'easeOut' },
            scale:   { duration: 0.12, ease: 'easeOut' },
            left:    { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] },
            top:     { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] },
          }}
          style={{
            position: 'absolute',
            width: CARD_W,
            zIndex: 1000,
            backgroundColor: theme.semantic.common.white,
            backgroundImage: theme.surfaceOverlay.high,
            border: `1px solid ${theme.semantic.divider}`,
            borderRadius: theme.customBorderRadius.lg,
            boxShadow: theme.customShadows.lg,
            pointerEvents: 'auto',
          }}
        >
          {peekContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// ReactMarker — renders a React node inside a Leaflet DivIcon
// ---------------------------------------------------------------------------
function ReactMarker({
  marker,
  onMarkerClick,
}: {
  marker: MapMarker;
  onMarkerClick?: (marker: MapMarker) => void;
}) {
  const theme = useTheme();
  const elRef = useRef(document.createElement('div'));
  const rootRef = useRef<Root | null>(null);
  // Guard so deferred cleanup from StrictMode doesn't destroy a remounted root
  const aliveRef = useRef(true);

  // Stable L.divIcon — never recreated; React content updates via useEffect
  const icon = React.useMemo(() => L.divIcon({
    html: elRef.current,
    className: 'sc-react-marker',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
  }), []);

  // Render React content into the container (post-render phase)
  useEffect(() => {
    aliveRef.current = true;
    if (!rootRef.current) {
      rootRef.current = createRoot(elRef.current);
    }
    rootRef.current.render(<ThemeProvider theme={theme}>{marker.icon}</ThemeProvider>);
    return () => {
      aliveRef.current = false;
      const r = rootRef.current;
      rootRef.current = null;
      if (r) {
        // Defer unmount to avoid "synchronously unmount while rendering" error.
        // The aliveRef guard prevents this from destroying a StrictMode-remounted root.
        setTimeout(() => { if (!aliveRef.current) r.unmount(); }, 0);
      }
    };
  }, [marker.icon, theme]);

  return (
    <Marker
      position={[marker.lat, marker.lng]}
      icon={icon}
      zIndexOffset={marker.zIndexOffset ?? (marker.active ? 1000 : marker.muted ? -100 : marker.dimmed ? 200 : 500)}
      eventHandlers={
        onMarkerClick
          ? { click: () => onMarkerClick(marker) }
          : undefined
      }
    />
  );
}

// ---------------------------------------------------------------------------
// DefaultMarker — standard Leaflet marker with optional popup and click
// ---------------------------------------------------------------------------
function DefaultMarker({
  marker,
  onMarkerClick,
}: {
  marker: MapMarker;
  onMarkerClick?: (marker: MapMarker) => void;
}) {
  return (
    <Marker
      position={[marker.lat, marker.lng]}
      eventHandlers={
        onMarkerClick
          ? { click: () => onMarkerClick(marker) }
          : undefined
      }
    />
  );
}

// ---------------------------------------------------------------------------
// CustomMapInner
// ---------------------------------------------------------------------------
export default function CustomMapInner({
  lat,
  lng,
  onMapClick,
  placePinMode = false,
  onTogglePlacePin,
  recenterKey,
  recenterZoom,
  recenterTarget,
  onViewportChange,
  zoom = 13,
  height = 280,
  borderRadius: borderRadiusProp,
  marker = true,
  markers,
  onMarkerClick,
  interactive = true,
  radiusCircle,
  sx,
}: CustomMapInnerProps) {
  const theme = useTheme();
  const borderRadius = borderRadiusProp ?? theme.customBorderRadius.lg;
  // Resolve markers: auto-render LocationMarkerPin when name+accessType present
  const resolvedMarkers = markers?.map((m) => {
    const resolvedIcon = m.icon ?? (m.name && m.accessType ? (
      <LocationMarkerPin
        name={m.name}
        accessType={m.accessType}
        active={m.active}
        muted={m.muted}
        dimmed={m.dimmed}
        logoUrl={m.logoUrl}
      />
    ) : undefined);

    return { ...m, icon: resolvedIcon };
  });

  return (
    <>
      <style>{`
        .sc-react-marker {
          background: none !important;
          border: none !important;
        }
        .sc-themed-map .leaflet-tile-pane {
          filter: var(--sc-map-filter);
          mix-blend-mode: var(--sc-map-blend);
        }
        .sc-map-place-pin,
        .sc-map-place-pin .leaflet-interactive,
        .sc-map-place-pin .leaflet-grab,
        .sc-map-place-pin .leaflet-marker-icon {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 32 32'%3E%3Cpath d='M28.59 13.31L30 11.9L20 2L18.69 3.42L19.87 4.6L8.38 14.32L6.66 12.61L5.25 14L10.91 19.68L2 28.58L3.41 30L12.32 21.09L18 26.75L19.39 25.33L17.68 23.62L27.4 12.13L28.59 13.31Z' fill='%23dc2626'/%3E%3C/svg%3E") 2 22, crosshair !important;
        }
        .sc-themed-map .leaflet-control-container {
          z-index: 1100;
        }
        .sc-themed-map .sc-recenter-control,
        .sc-themed-map .sc-place-pin-btn {
          z-index: 1100;
        }
        .sc-map-zoomed-out .sc-pin-shadow {
          display: none;
        }
        .sc-themed-map .leaflet-tile-pane::after {
          content: '';
          position: absolute;
          inset: -200% -200%;
          width: 500%;
          height: 500%;
          background: var(--sc-map-overlay);
          mix-blend-mode: multiply;
          display: var(--sc-map-overlay-display);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <MapRoot
        className={`sc-themed-map${placePinMode ? ' sc-map-place-pin' : ''}`}
        borderRadius={borderRadius}
        height={height}
        sx={sx}
      >
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          scrollWheelZoom={interactive}
          dragging={interactive}
          zoomControl={interactive}
          style={{ width: '100%', height: '100%' }}
          attributionControl
        >
          <MapRecenter lat={lat} lng={lng} zoom={recenterZoom} recenterKey={recenterKey} />
          <ZoomWatcher />
          {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
          {interactive && <RecenterControl lat={lat} lng={lng} recenterTarget={recenterTarget} />}
          <ViewportTracker onViewportChange={onViewportChange} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Radius circle overlay */}
          {radiusCircle && (
            <Circle
              center={[radiusCircle.lat, radiusCircle.lng]}
              radius={radiusCircle.radiusMiles * 1609.34}
              pathOptions={{
                color: radiusCircle.color ?? '#2563eb',
                weight: 1.5,
                fillColor: radiusCircle.color ?? '#2563eb',
                fillOpacity: 0.08,
                dashArray: '6 4',
              }}
            />
          )}

          {/* Default center marker */}
          {marker && <Marker position={[lat, lng]} />}

          {/* Custom markers */}
          {resolvedMarkers?.map((m, index) => {
            const key = m.id ?? `marker-${index}`;
            if (m.icon) {
              return (
                <ReactMarker
                  key={key}
                  marker={m}
                  onMarkerClick={onMarkerClick}
                />
              );
            }
            return (
              <DefaultMarker
                key={key}
                marker={m}
                onMarkerClick={onMarkerClick}
              />
            );
          })}

          {/* Viewport-aware peek card for active marker */}
          <PeekOverlay markers={markers} />
        </MapContainer>

        {/* Place-pin toggle button — rendered when onMapClick is provided */}
        {onMapClick && (
          <PlacePinButton
            onClick={onTogglePlacePin}
            active={placePinMode}
            title={placePinMode ? 'Cancel pin placement' : 'Place pin on map'}
          >
            <PinFilledIcon size={16} color={placePinMode ? 'white' : theme.semantic.error.main} />
          </PlacePinButton>
        )}
      </MapRoot>
    </>
  );
}
