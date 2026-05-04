'use client';

import React from 'react';
import { useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import ImagePlaceholder from './ImagePlaceholder';
import {
  BuildingIcon,
  CalendarCancelIcon,
  CalendarCheckedIcon,
  CheckmarkFilledIcon,
  HelpFilledIcon,
  ReviewIcon,
  StarFilledIcon,
  StarOutlineIcon,
} from './icons';
import {
  CardRoot,
  DistanceText,
  DotSeparator,
  FavToggleBox,
  HelpIconBox,
  InfoColumn,
  LeftColumn,
  MetaColumn,
  MetaLabel,
  MetaRow,
  NameRow,
  NameText,
  OfficesRow,
  OfficesText,
  SelectedIndicatorBox,
  VerticalDivider,
} from './CSPCard.styles';

export interface CSPCardMetaItem {
  icon: React.ReactElement;
  label: string;
  labelColor?: string;
  helpText?: string;
}

export interface CSPCardProps {
  name: string;
  logoUrl?: string;
  favorited?: boolean;
  onToggleFavorite?: () => void;
  officeCount?: number;
  distance?: string;
  rating?: number;
  reviewCount?: number;
  accessType?: 'live' | 'standalone';
  standardClose?: string;
  rapidClose?: string;
  metaItems?: CSPCardMetaItem[];
  selected?: boolean;
  muted?: boolean;
  nameHref?: string;
  onClick?: () => void;
}

export default function CSPCard({
  name,
  logoUrl,
  favorited = false,
  onToggleFavorite,
  accessType,
  officeCount = 0,
  distance,
  rating = 0,
  reviewCount = 0,
  metaItems,
  selected = false,
  muted = false,
  nameHref,
  onClick,
}: CSPCardProps) {
  const theme = useTheme();

  const resolvedMeta: CSPCardMetaItem[] = metaItems ?? [
    ...(accessType === 'live'
      ? [
          {
            icon: <CalendarCheckedIcon size={16} color={theme.semantic.primary.main} />,
            label: 'Live',
            labelColor: theme.semantic.primary.dark,
            helpText: 'Live calendar connected. Real-time availability shown when scheduling.',
          },
        ]
      : accessType === 'standalone'
        ? [
            {
              icon: <CalendarCancelIcon size={16} color={theme.semantic.warning.main} />,
              label: 'Standalone',
              labelColor: theme.semantic.warning.dark,
              helpText: 'No live calendar connected. Availability is confirmed manually.',
            },
          ]
        : []),
    {
      icon: <ReviewIcon size={16} color={theme.semantic.text.secondary} />,
      label: `${rating.toFixed(1)}/5 (${reviewCount} review${reviewCount !== 1 ? 's' : ''})`,
    },
  ];

  return (
    <CardRoot onClick={onClick} selected={selected} muted={muted}>
      <LeftColumn>
        <ImagePlaceholder
          placeholderType={logoUrl ? 'Image' : 'Initials'}
          name={name}
          src={logoUrl}
          shape="RoundedSquare"
          size={56}
        />

        <InfoColumn>
          <NameRow>
            <FavToggleBox
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite?.();
              }}
            >
              <IconTooltip
                title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                icon={favorited ? <StarFilledIcon size={20} /> : <StarOutlineIcon size={20} />}
                color={favorited ? theme.colors.amber[400] : theme.semantic.text.disabled}
                size={20}
              />
            </FavToggleBox>
            <NameText
              component={nameHref ? 'a' : 'span'}
              {...(nameHref
                ? {
                    href: nameHref,
                    onClick: (event: React.MouseEvent) => event.stopPropagation(),
                  }
                : {})}
              isLink={Boolean(nameHref)}
            >
              {name}
            </NameText>
          </NameRow>

          <OfficesRow>
            <BuildingIcon size={16} color={theme.semantic.text.secondary} />
            <OfficesText>
              {officeCount} office{officeCount !== 1 ? 's' : ''}
            </OfficesText>
            {distance && (
              <>
                <DotSeparator>.</DotSeparator>
                <DistanceText>{distance}</DistanceText>
              </>
            )}
          </OfficesRow>
        </InfoColumn>
      </LeftColumn>

      <VerticalDivider />

      <MetaColumn>
        {resolvedMeta.map((item, index) => (
          <MetaRow key={index}>
            {item.icon}
            <MetaLabel labelColor={item.labelColor}>{item.label}</MetaLabel>
            {item.helpText && (
              <HelpIconBox onClick={(event) => event.stopPropagation()}>
                <IconTooltip
                  title={item.helpText}
                  icon={<HelpFilledIcon size={14} />}
                  size={14}
                  color={theme.semantic.text.disabled}
                />
              </HelpIconBox>
            )}
          </MetaRow>
        ))}
      </MetaColumn>

      <SelectedIndicatorBox>
        {selected && <CheckmarkFilledIcon size={20} color={theme.semantic.primary.main} />}
      </SelectedIndicatorBox>
    </CardRoot>
  );
}
