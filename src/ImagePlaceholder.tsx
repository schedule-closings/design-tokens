'use client';

/**
 * ImagePlaceholder - profile photo / image slot with appointment status badges.
 *
 * Usage:
 *   // Empty image slot (circle)
 *   <ImagePlaceholder shape="Circle" size={80} />
 *
 *   // Initials generated from a name (person, office, or company)
 *   <ImagePlaceholder placeholderType="Initials" name="John Smith" shape="Circle" />
 *
 *   // Actual photo
 *   <ImagePlaceholder src="/photo.jpg" alt="John Smith" shape="Circle" size={64} />
 *
 *   // With appointment status badge
 *   <ImagePlaceholder shape="Quadrilateral" roundedCorners appointmentStatus="Yes" />
 *
 * Props:
 *   placeholderType  'Image' | 'Initials'  - whether to show image icon or initials (default 'Image')
 *   src              string                - actual image URL; when provided, fills the shape
 *   alt              string                - alt text for the image
 *   name             string                - name to derive initials from (person, office, or company)
 *   shape            'Circle' | 'Quadrilateral' | 'RoundedSquare'
 *   ratio            '1:1' | '16:9'
 *   roundedCorners   boolean               - applies iOS squircle corners (Quadrilateral only)
 *   appointmentStatus 'Default' | 'Yes' | 'No' | 'Unknown' | 'Requested'
 *   licensed         boolean               - shows gold verified-license badge on Default status
 *   size             number                - height in px (default 120)
 *   sx               MUI sx prop
 */

import React from 'react';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import SmoothBox from './SmoothBox';
import { CheckmarkFilledAltIcon, HelpFilledIcon, ImageIcon } from './icons';
import { IconProps } from './icons';
import {
  PlaceholderRoot,
  ShapeContainer,
  BadgeWrapper,
  CenteredOverlay,
  InitialsText,
  ImageElement,
} from './ImagePlaceholder.styles';

export interface ImagePlaceholderProps {
  placeholderType?: 'Image' | 'Initials';
  src?: string;
  alt?: string;
  name?: string;
  shape?: 'Circle' | 'Quadrilateral' | 'RoundedSquare';
  ratio?: '1:1' | '16:9';
  roundedCorners?: boolean;
  appointmentStatus?: 'Default' | 'Yes' | 'No' | 'Unknown' | 'Requested';
  licensed?: boolean;
  size?: number;
  sx?: SxProps<Theme>;
}

type BadgeConfig = { Icon: React.FC<IconProps>; color?: string } | null;

/** Yes badge: green/200 background circle, success/dark checkmark. */
function YesBadgeIcon({ size }: IconProps) {
  const theme = useTheme();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2Z"
        fill={theme.colors.green[200]}
      />
      <path
        d="M9 16.5908L14 21.5908L23.0057 12.5859L21.41 11L14 18.4092L10.5906 15L9 16.5908Z"
        fill={theme.semantic.success.dark}
      />
    </svg>
  );
}

/** No badge: red/200 background circle, error/dark X symbol. */
function NoBadgeIcon({ size }: IconProps) {
  const theme = useTheme();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M16 2C8.2 2 2 8.2 2 16C2 23.8 8.2 30 16 30C23.8 30 30 23.8 30 16C30 8.2 23.8 2 16 2Z"
        fill={theme.colors.red[200]}
      />
      <path
        d="M21.4 23L16 17.6L10.6 23L9 21.4L14.4 16L9 10.6L10.6 9L16 14.4L21.4 9L23 10.6L17.6 16L23 21.4L21.4 23Z"
        fill={theme.semantic.error.dark}
      />
    </svg>
  );
}

/** Requested badge: yellow/100 background circle, alert/dark arrow. */
function RequestedBadgeIcon({ size }: IconProps) {
  const theme = useTheme();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2Z"
        fill={theme.colors.yellow[100]}
      />
      <path
        d="M20.0625 9L18.3833 10.6498L21.4486 13.6667H11.75C10.4902 13.6667 9.28204 14.1583 8.39124 15.0335C7.50044 15.9087 7 17.0957 7 18.3333C7 19.571 7.50044 20.758 8.39124 21.6332C9.28204 22.5083 10.4902 23 11.75 23H14.125V20.6667H11.75C11.1201 20.6667 10.516 20.4208 10.0706 19.9832C9.62522 19.5457 9.375 18.9522 9.375 18.3333C9.375 17.7145 9.62522 17.121 10.0706 16.6834C10.516 16.2458 11.1201 16 11.75 16H21.4486L18.3816 19.0186L20.0625 20.6667L26 14.8333L20.0625 9Z"
        fill={theme.semantic.alert.dark}
      />
    </svg>
  );
}

/** Extract up to two initials from a person, office, or company name. */
export function getInitials(name?: string): string {
  if (!name) return '';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0].slice(0, 2).toUpperCase();
}

/**
 * AA-contrast background colors for the Initials variant.
 * Each entry: [bgColor, textColor] - all pass WCAG 2.2 AA (4.5:1+) on white text.
 */
function getInitialsPalette(theme: Theme): [string, string][] {
  return [
    [theme.colors.blue[600], '#ffffff'],
    [theme.colors.purple[600], '#ffffff'],
    [theme.colors.teal[600], '#ffffff'],
    [theme.colors.green[700], '#ffffff'],
    [theme.colors.red[600], '#ffffff'],
    [theme.colors.orange[700], '#ffffff'],
    [theme.colors.slate[600], '#ffffff'],
    [theme.colors.blue[800], '#ffffff'],
    [theme.colors.purple[800], '#ffffff'],
    [theme.colors.teal[800], '#ffffff'],
  ];
}

/** Deterministic color from name string; same name always gets the same color. */
function getInitialsColor(name: string | undefined, theme: Theme): [string, string] {
  const palette = getInitialsPalette(theme);
  if (!name) return palette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return palette[Math.abs(hash) % palette.length];
}

function getBadge(
  appointmentStatus: ImagePlaceholderProps['appointmentStatus'],
  licensed: boolean,
  theme: Theme
): BadgeConfig {
  if (appointmentStatus === 'Yes') {
    // Licensed providers use primary/main bg (blue) instead of green
    return licensed
      ? { Icon: CheckmarkFilledAltIcon, color: theme.semantic.primary.main }
      : { Icon: YesBadgeIcon };
  }
  if (appointmentStatus === 'No') return { Icon: NoBadgeIcon };
  if (appointmentStatus === 'Unknown') return { Icon: HelpFilledIcon, color: theme.colors.slate[400] };
  if (appointmentStatus === 'Requested') return { Icon: RequestedBadgeIcon };
  // Default: show licensed badge when applicable.
  if (licensed) return { Icon: CheckmarkFilledAltIcon, color: theme.semantic.primary.main };
  return null;
}

export default function ImagePlaceholder({
  placeholderType = 'Image',
  src,
  alt = '',
  name,
  shape = 'Circle',
  ratio = '1:1',
  roundedCorners = true,
  appointmentStatus = 'Default',
  licensed = false,
  size = 120,
  sx,
}: ImagePlaceholderProps) {
  const theme = useTheme();
  const width = ratio === '16:9' ? Math.round((size * 16) / 9) : size;
  const isCircle = shape === 'Circle';
  const isRoundedSquare = shape === 'RoundedSquare';
  const useSquircle = !isCircle && !isRoundedSquare && roundedCorners;

  const isInitials = placeholderType === 'Initials';
  const badge = getBadge(appointmentStatus, licensed, theme);

  // Badge dimensions: 40 % of container height, with 6.67 % overflow past bottom-right
  const badgeSize = Math.round(size * 0.4);
  const badgeOverflow = Math.round(size * 0.0667);

  const [initialsBg, initialsTextColor] = isInitials ? getInitialsColor(name, theme) : ['', ''];

  // Border scales with size: 1px at 56px (~1.8% ratio), min 0.5px
  const borderWidth = Math.max(0.5, Math.round(size * 0.018 * 10) / 10);

  // RoundedSquare: 8px at 56px (~14% ratio), scales proportionally with size, min 4px
  const roundedSquareRadius = isRoundedSquare ? Math.max(4, Math.round(size * 0.143)) : 0;
  const shapeRadius = isCircle ? theme.customBorderRadius.full : isRoundedSquare ? `${roundedSquareRadius}px` : 0;

  // Shared shape container props
  const shapeProps = {
    isInitials,
    hasSrc: Boolean(src),
    initialsBg,
    borderWidth,
  };

  return (
    <PlaceholderRoot ownerWidth={width} ownerHeight={size} sx={sx}>
      {/* Inner shape clips image/initials to the chosen geometry. */}
      {useSquircle ? (
        <SmoothBox
          smoothRadius={theme.customBorderRadius.lg}
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            ...(isInitials
              ? {
                  backgroundColor: initialsBg,
                  border: `${borderWidth}px solid rgba(0,0,0,0.1)`,
                }
              : {
                  backgroundColor: src ? 'transparent' : theme.colors.slate[100],
                  border: `${borderWidth}px solid ${theme.colors.slate[300]}`,
                }),
          }}
        >
          <ShapeContentInner isInitials={isInitials} src={src} alt={alt} name={name} size={size} initialsTextColor={initialsTextColor} />
        </SmoothBox>
      ) : (
        <ShapeContainer {...shapeProps} style={{ borderRadius: shapeRadius }}>
          <ShapeContentInner isInitials={isInitials} src={src} alt={alt} name={name} size={size} initialsTextColor={initialsTextColor} />
        </ShapeContainer>
      )}

      {/* Status / licensed badge overflows bottom-right corner. */}
      {badge && (
        <BadgeWrapper badgeSize={badgeSize} badgeOverflow={badgeOverflow} aria-hidden="true">
          <badge.Icon size={badgeSize} color={badge.color} />
        </BadgeWrapper>
      )}
    </PlaceholderRoot>
  );
}

interface ShapeContentProps {
  isInitials: boolean;
  src?: string;
  alt: string;
  name?: string;
  size: number;
  initialsTextColor?: string;
}

/** Inner content: initials, actual image, or image placeholder icon. */
function ShapeContentInner({ isInitials, src, alt, name, size, initialsTextColor }: ShapeContentProps) {
  const theme = useTheme();
  const iconSize = Math.round(size * 0.4);

  if (isInitials) {
    return (
      <CenteredOverlay>
        <InitialsText iconSize={iconSize} initialsTextColor={initialsTextColor || theme.semantic.text.secondary}>
          {getInitials(name)}
        </InitialsText>
      </CenteredOverlay>
    );
  }

  if (src) {
    return <ImageElement src={src} alt={alt} />;
  }

  // Empty image placeholder: gray background plus ImageIcon.
  return (
    <CenteredOverlay>
      <ImageIcon size={iconSize} color={theme.colors.slate[400]} />
    </CenteredOverlay>
  );
}
