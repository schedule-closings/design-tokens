'use client';

import React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import ImagePlaceholder from './ImagePlaceholder';
import {
  BuildingIcon,
  CalendarCancelIcon,
  CalendarCheckedIcon,
  LocationOutlineIcon,
  ReviewIcon,
} from './icons';
import {
  AddressIconWrap,
  AddressRow,
  GroundShadow,
  MetaRow,
  MetaText,
  PeekCardMeta,
  PeekCardName,
  PeekCardRoot,
  PinFrame,
  PinRoot,
} from './LocationMarkerPin.styles';

export type AccessType = 'live' | 'standalone';

export interface LocationMarkerPinProps {
  /** CSP / firm display name. */
  name: string;
  /** Access type determines pin color: blue for live or yellow for standalone. */
  accessType: AccessType;
  /** Whether this pin is in active/selected state. */
  active?: boolean;
  /** When true, renders the pin in grayscale. */
  muted?: boolean;
  /** When true, reduces visual weight for a related, non-selected office. */
  dimmed?: boolean;
  /** Optional logo image URL; falls back to initials via ImagePlaceholder. */
  logoUrl?: string;
  /** Click handler on the pin itself. */
  onClick?: () => void;
}

export interface LocationPeekCardProps {
  /** CSP / firm display name. */
  name: string;
  /** Access type label and color. */
  accessType: AccessType;
  /** Optional logo image URL. */
  logoUrl?: string;
  /** Office / branch name. */
  officeName?: string;
  /** Distance from property address, e.g. "2.5 mi". */
  distance?: string;
  /** Rating value, e.g. 4.7. */
  rating?: number;
  /** Number of reviews. */
  reviewCount?: number;
  /** Full address string. */
  address?: string;
}

type AccessColors = {
  frame: string;
  stroke: string;
  caret: string;
  label: string;
  text: string;
};

type DimmedColors = Pick<AccessColors, 'frame' | 'stroke' | 'caret'>;

function getAccessColors(theme: Theme): Record<AccessType, AccessColors> {
  const isDark = theme.palette.mode === 'dark';
  const liveFrame = isDark ? theme.colors.blue[600] : theme.semantic.primary.main;
  const standaloneFrame = isDark ? theme.colors.yellow[600] : theme.colors.yellow[500];

  return {
    live: {
      frame: liveFrame,
      stroke: theme.semantic.primary.dark,
      caret: liveFrame,
      label: theme.semantic.primary.dark,
      text: 'Live',
    },
    standalone: {
      frame: standaloneFrame,
      stroke: theme.semantic.alert.dark,
      caret: standaloneFrame,
      label: theme.semantic.alert.dark,
      text: 'Standalone',
    },
  };
}

function getDimmedColors(theme: Theme): Record<AccessType, DimmedColors> {
  return {
    live: {
      frame: theme.colors.blue[300],
      stroke: theme.semantic.primary.light,
      caret: theme.colors.blue[300],
    },
    standalone: {
      frame: theme.colors.yellow[300],
      stroke: theme.semantic.alert.light,
      caret: theme.colors.yellow[300],
    },
  };
}

function PinCaret({
  color,
  strokeColor,
  width = 16,
}: {
  color: string;
  strokeColor?: string;
  width?: number;
}) {
  const height = width * 0.6;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 10"
      fill="none"
      style={{ display: 'block', marginTop: -2 }}
      aria-hidden="true"
    >
      {strokeColor && <path d="M8 10L0 0H16L8 10Z" fill={strokeColor} />}
      <path d="M8 8L1 0H15L8 8Z" fill={color} />
    </svg>
  );
}

export function LocationMarkerPin({
  name,
  accessType,
  active = false,
  muted = false,
  dimmed = false,
  logoUrl,
  onClick,
}: LocationMarkerPinProps) {
  const theme = useTheme();
  const accessColors = getAccessColors(theme);
  const dimmedColors = getDimmedColors(theme);
  const colors = dimmed ? dimmedColors[accessType] : accessColors[accessType];
  const logoSize = active ? 28 : 22;
  const padding = active ? 5 : 4;
  const caretWidth = active ? 18 : 14;

  return (
    <PinRoot onClick={onClick} ownerMuted={muted} ownerDimmed={dimmed}>
      <PinFrame frameColor={colors.frame} strokeColor={colors.stroke} ownerPadding={padding}>
        <ImagePlaceholder
          placeholderType={logoUrl ? 'Image' : 'Initials'}
          name={name}
          size={logoSize}
          shape="RoundedSquare"
          src={logoUrl}
          sx={{
            '& > *': {
              borderColor: 'white !important',
              borderWidth: '1.5px !important',
            },
          }}
        />
      </PinFrame>

      <PinCaret color={colors.caret} strokeColor={colors.stroke} width={caretWidth} />
      <GroundShadow className="sc-pin-shadow" ownerActive={active} />
    </PinRoot>
  );
}

export function LocationPeekCard({
  name,
  accessType,
  logoUrl,
  officeName,
  distance,
  rating,
  reviewCount,
  address,
}: LocationPeekCardProps) {
  const theme = useTheme();
  const accessColors = getAccessColors(theme)[accessType];

  return (
    <PeekCardRoot>
      <ImagePlaceholder
        placeholderType={logoUrl ? 'Image' : 'Initials'}
        name={name}
        size={52}
        shape="RoundedSquare"
        src={logoUrl}
        sx={{ flexShrink: 0 }}
      />

      <PeekCardMeta>
        <PeekCardName>{name}</PeekCardName>

        <MetaRow>
          {accessType === 'live' ? (
            <CalendarCheckedIcon size={18} color={accessColors.label} />
          ) : (
            <CalendarCancelIcon size={18} color={accessColors.label} />
          )}
          <MetaText ownerColor={accessColors.label}>{accessColors.text}</MetaText>
        </MetaRow>

        {officeName && (
          <MetaRow>
            <BuildingIcon size={18} color={theme.semantic.text.secondary} />
            <MetaText ownerColor={theme.semantic.text.secondary}>
              {officeName}
              {distance ? ` - ${distance}` : ''}
            </MetaText>
          </MetaRow>
        )}

        {rating != null && (
          <MetaRow>
            <ReviewIcon size={18} color={theme.semantic.text.secondary} />
            <MetaText ownerColor={theme.semantic.text.secondary}>
              {rating}/5{reviewCount != null ? ` (${reviewCount} reviews)` : ''}
            </MetaText>
          </MetaRow>
        )}

        {address && (
          <AddressRow>
            <AddressIconWrap>
              <LocationOutlineIcon size={18} color={theme.semantic.text.secondary} />
            </AddressIconWrap>
            <MetaText ownerColor={theme.semantic.text.secondary}>{address}</MetaText>
          </AddressRow>
        )}
      </PeekCardMeta>
    </PeekCardRoot>
  );
}

export default LocationMarkerPin;
