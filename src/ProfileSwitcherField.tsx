'use client';

import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import SmoothBox from './SmoothBox';
import { AddIcon, CheckmarkFilledAltIcon, ChevronDownIcon } from './icons';
import { useDropdownPlacement } from './useDropdownPlacement';
import { useInheritedColorMode } from './useInheritedColorMode';
import {
  ProfileSwitcherChip,
  ProfileSwitcherFooterAction,
  ProfileSwitcherGroup,
  ProfileSwitcherGroupChildren,
  ProfileSwitcherGroupHeader,
  ProfileSwitcherItem,
  ProfileSwitcherItemCount,
  ProfileSwitcherItemLabel,
  ProfileSwitcherLabel,
  ProfileSwitcherListRoot,
} from './ProfileSwitcherField.styles';

export interface ProfileSwitcherChildOption {
  value: string;
  label: string;
}

export interface ProfileSwitcherOption {
  value: string;
  label: string;
  /** Muted "(N)" count rendered after the label. */
  count?: number;
  /**
   * Created profiles of this profile type. When present and non-empty, the row
   * renders as a hover-to-expand group: hovering the parent reveals children,
   * and selection happens on a child.
   */
  children?: ProfileSwitcherChildOption[];
}

export interface ProfileSwitcherFieldProps {
  /** Currently-selected option value. */
  value: string | null;
  /** Called when a profile option is selected. */
  onChange?: (value: string) => void;
  options: ProfileSwitcherOption[];
  /** When true, the trigger renders in the muted slate state. */
  impersonated?: boolean;
  /** Called when the user clicks the optional "All Profiles" entry. */
  onViewAllProfiles?: () => void;
  /** Called when the user clicks the optional "File Starter" entry. */
  onViewFileStarter?: () => void;
  /** Called when the user clicks the optional footer "Add Profile" action. */
  onAddProfile?: () => void;
  /** Text to show in the trigger when no option is selected. */
  placeholder?: string;
  sx?: SxProps<Theme>;
}

const ICON_SIZE = 20;

type ColorModePaperSlotProps = NonNullable<React.ComponentProps<typeof Popover>['slotProps']>['paper'] & {
  'data-color-mode'?: 'light' | 'dark';
};

function getColorModePaperProps(
  mode: 'light' | 'dark' | undefined,
  sx: Record<string, unknown>,
): ColorModePaperSlotProps {
  return {
    ...(mode ? { 'data-color-mode': mode } : {}),
    sx,
  } as ColorModePaperSlotProps;
}

function UserProfileAltIcon({ size = ICON_SIZE, color = 'currentColor' }: { size?: number; color?: string }) {
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
        d="M19 13H26V15H19V13ZM19 8H30V10H19V8ZM19 3H30V5H19V3ZM11 30H7.00001C6.47005 29.9984 5.96225 29.7872 5.58751 29.4125C5.21278 29.0378 5.00156 28.53 5.00001 28V21C4.47005 20.9984 3.96225 20.7872 3.58751 20.4125C3.21278 20.0378 3.00156 19.53 3.00001 19V13C2.99275 12.604 3.06539 12.2107 3.21358 11.8434C3.36178 11.4762 3.58249 11.1426 3.86252 10.8625C4.14256 10.5825 4.47617 10.3618 4.84343 10.2136C5.21068 10.0654 5.60404 9.99274 6.00001 10H12C12.396 9.99274 12.7893 10.0654 13.1566 10.2136C13.5238 10.3618 13.8575 10.5825 14.1375 10.8625C14.4175 11.1426 14.6382 11.4762 14.7864 11.8434C14.9346 12.2107 15.0073 12.604 15 13V19C14.9985 19.53 14.7872 20.0378 14.4125 20.4125C14.0378 20.7872 13.53 20.9984 13 21V28C12.9985 28.53 12.7872 29.0378 12.4125 29.4125C12.0378 29.7872 11.53 29.9984 11 30ZM6.00001 12C5.86659 11.992 5.73297 12.0123 5.608 12.0597C5.48302 12.1071 5.36953 12.1805 5.27502 12.275C5.1805 12.3695 5.10712 12.483 5.05971 12.608C5.0123 12.733 4.99195 12.8666 5.00001 13V19H7.00001V28H11V19H13V13C13.0081 12.8666 12.9877 12.733 12.9403 12.608C12.8929 12.483 12.8195 12.3695 12.725 12.275C12.6305 12.1805 12.517 12.1071 12.392 12.0597C12.267 12.0123 12.1334 11.992 12 12H6.00001ZM9.00001 9C8.20888 9 7.43552 8.76541 6.77773 8.32588C6.11993 7.88635 5.60724 7.26164 5.30449 6.53074C5.00174 5.79983 4.92252 4.99556 5.07687 4.21964C5.23121 3.44372 5.61217 2.73098 6.17158 2.17157C6.73099 1.61216 7.44372 1.2312 8.21965 1.07686C8.99557 0.92252 9.79984 1.00173 10.5307 1.30448C11.2616 1.60723 11.8864 2.11992 12.3259 2.77772C12.7654 3.43552 13 4.20888 13 5C12.9969 6.05991 12.5745 7.07552 11.825 7.82499C11.0755 8.57446 10.0599 8.99689 9.00001 9ZM9.00001 3C8.60444 3 8.21776 3.1173 7.88887 3.33706C7.55997 3.55683 7.30362 3.86918 7.15225 4.23463C7.00087 4.60009 6.96127 5.00222 7.03844 5.39018C7.11561 5.77814 7.30609 6.13451 7.58579 6.41422C7.8655 6.69392 8.22186 6.8844 8.60983 6.96157C8.99779 7.03874 9.39992 6.99914 9.76537 6.84776C10.1308 6.69639 10.4432 6.44004 10.6629 6.11114C10.8827 5.78224 11 5.39556 11 5C10.9985 4.47005 10.7872 3.96224 10.4125 3.58751C10.0378 3.21277 9.52996 3.00156 9.00001 3Z"
        fill={color}
      />
    </svg>
  );
}

export default function ProfileSwitcherField({
  value,
  onChange,
  options,
  impersonated = false,
  onViewAllProfiles,
  onViewFileStarter,
  onAddProfile,
  placeholder = 'Select profile',
  sx,
}: ProfileSwitcherFieldProps) {
  const theme = useTheme();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { placement, maxHeight } = useDropdownPlacement(anchorRef.current, { open: isOpen });
  const isTop = placement === 'top';
  const inheritedMode = useInheritedColorMode(anchorRef.current, isOpen);

  const selected = (() => {
    const direct = options.find((option) => option.value === value);
    if (direct) return direct;

    for (const option of options) {
      if (option.children?.some((child) => child.value === value)) return option;
    }

    return null;
  })();
  const displayLabel = selected?.label ?? placeholder;
  const iconColor = isOpen ? theme.colors.blue[900] : theme.colors.slate[600];

  function handleOpen(event: React.MouseEvent) {
    event.preventDefault();
    setIsOpen(true);
  }

  function handleSelect(selectedValue: string) {
    onChange?.(selectedValue);
    setIsOpen(false);
  }

  return (
    <>
      <ProfileSwitcherChip
        ref={anchorRef}
        open={isOpen}
        impersonated={impersonated}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleOpen}
        sx={sx}
      >
        <UserProfileAltIcon size={ICON_SIZE} color={iconColor} />
        <ProfileSwitcherLabel>{displayLabel}</ProfileSwitcherLabel>
        <ChevronDownIcon size={ICON_SIZE} color={iconColor} />
      </ProfileSwitcherChip>

      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{ vertical: isTop ? 'top' : 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: isTop ? 'bottom' : 'top', horizontal: 'left' }}
        slotProps={{
          paper: getColorModePaperProps(inheritedMode, {
              borderRadius: theme.customBorderRadius.xl,
              overflow: 'visible',
              boxShadow: 'none',
              mt: isTop ? 0 : theme.customSpacing[1],
              mb: isTop ? theme.customSpacing[1] : 0,
              minWidth: anchorRef.current?.offsetWidth,
          }),
        }}
      >
        <SmoothBox
          smoothRadius={theme.customBorderRadius.xl}
          sx={{
            bgcolor: theme.semantic.common.white,
            backgroundImage: theme.surfaceOverlay.high,
            boxShadow: theme.customShadows.lg,
            border: `1px solid ${theme.colors.slate[100]}`,
            display: 'flex',
            flexDirection: 'column',
            maxHeight,
            overflow: 'hidden',
          }}
        >
          <ProfileSwitcherListRoot
            role="listbox"
            sx={{
              overflowY: 'auto',
              padding: theme.customSpacing[3],
              flex: 1,
              minHeight: 0,
            }}
          >
            {onViewAllProfiles && (
              <ProfileSwitcherItem
                role="option"
                onClick={() => {
                  onViewAllProfiles();
                  setIsOpen(false);
                }}
              >
                <ProfileSwitcherItemLabel>All Profiles</ProfileSwitcherItemLabel>
              </ProfileSwitcherItem>
            )}
            {onViewFileStarter && (
              <ProfileSwitcherItem
                role="option"
                onClick={() => {
                  onViewFileStarter();
                  setIsOpen(false);
                }}
              >
                <ProfileSwitcherItemLabel>File Starter</ProfileSwitcherItemLabel>
              </ProfileSwitcherItem>
            )}
            {options.map((option) => {
              const hasChildren = Boolean(option.children?.length);
              if (hasChildren) {
                const hasSelectedChild = option.children!.some((child) => child.value === value);
                return (
                  <ProfileSwitcherGroup key={option.value} forceExpanded={hasSelectedChild}>
                    <ProfileSwitcherGroupHeader>
                      <ProfileSwitcherItemLabel>
                        <span>{option.label}</span>
                        {typeof option.count === 'number' && (
                          <ProfileSwitcherItemCount>({option.count})</ProfileSwitcherItemCount>
                        )}
                      </ProfileSwitcherItemLabel>
                    </ProfileSwitcherGroupHeader>
                    <ProfileSwitcherGroupChildren className="profile-switcher-children">
                      {option.children!.map((child) => {
                        const isSelected = child.value === value;
                        return (
                          <ProfileSwitcherItem
                            key={child.value}
                            role="option"
                            aria-selected={isSelected}
                            isSelected={isSelected}
                            isChild
                            onClick={() => handleSelect(child.value)}
                          >
                            <ProfileSwitcherItemLabel>
                              <span>{child.label}</span>
                            </ProfileSwitcherItemLabel>
                            {isSelected && (
                              <CheckmarkFilledAltIcon size={ICON_SIZE} color={theme.semantic.primary.main} />
                            )}
                          </ProfileSwitcherItem>
                        );
                      })}
                    </ProfileSwitcherGroupChildren>
                  </ProfileSwitcherGroup>
                );
              }

              const isSelected = option.value === value;
              return (
                <ProfileSwitcherItem
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  isSelected={isSelected}
                  onClick={() => handleSelect(option.value)}
                >
                  <ProfileSwitcherItemLabel>
                    <span>{option.label}</span>
                    {typeof option.count === 'number' && (
                      <ProfileSwitcherItemCount>({option.count})</ProfileSwitcherItemCount>
                    )}
                  </ProfileSwitcherItemLabel>
                  {isSelected && (
                    <CheckmarkFilledAltIcon size={ICON_SIZE} color={theme.semantic.primary.main} />
                  )}
                </ProfileSwitcherItem>
              );
            })}
          </ProfileSwitcherListRoot>
          {onAddProfile && (
            <Box
              sx={{
                borderTop: `1px solid ${theme.semantic.divider}`,
                padding: theme.customSpacing[3],
                flexShrink: 0,
                bgcolor: theme.semantic.common.white,
                backgroundImage: theme.surfaceOverlay.high,
              }}
            >
              <ProfileSwitcherFooterAction
                onClick={() => {
                  onAddProfile();
                  setIsOpen(false);
                }}
              >
                <span>Add Profile</span>
                <AddIcon size={ICON_SIZE} color={theme.semantic.primary.main} />
              </ProfileSwitcherFooterAction>
            </Box>
          )}
        </SmoothBox>
      </Popover>
    </>
  );
}
