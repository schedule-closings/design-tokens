'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Popover from '@mui/material/Popover';
import { Theme, useTheme } from '@mui/material/styles';
import BaseButton from './BaseButton';
import { useColorMode } from './ColorModeContext';
import ImagePlaceholder from './ImagePlaceholder';
import Toggle from './Toggle';
import {
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  DocumentViewIcon,
  EventScheduleIcon,
  MoonFilledIcon,
  SettingsAdjustIcon,
  ViewFilledIcon,
} from './icons';
import type { IconProps } from './icons';
import {
  LIAppBar,
  LICloseIconBtn,
  LIDesktopTabletRow,
  LIDividerBox,
  LIDrawerCloseBar,
  LIDrawerColumnBox,
  LIDrawerDividerBox,
  LIDrawerMenuItemsBox,
  LIDrawerProfileHeaderBox,
  LIDropdownIconBox,
  LIDropdownItem,
  LIDropdownItemBtn,
  LIDropdownLabel,
  LIHamburgerBtn,
  LILeftBox,
  LIMenuItemsBox,
  LIMobileLeftCol,
  LIMobileNotificationsBtn,
  LIMobileRightCol,
  LIMobileRow,
  LINavDrawerItem,
  LINavDrawerItemLabel,
  LINavDrawerList,
  LINotificationsIconBtn,
  LIOuterContainer,
  LIProfileButton,
  LIProfileEmailText,
  LIProfileHeaderBox,
  LIProfileNameText,
  LIProfileTextCol,
  LIResourcesIconBtn,
  LIRightBox,
  LIScheduleClosingIconBtn,
  LISendInviteIconBtn,
  LIToolbar,
  LIViewingDesktopBox,
  LIViewingLink,
  LIViewingMobilePill,
  LIViewingPill,
  LIViewingText,
  getFullLogoStyles,
  getNavDrawerPaperStyles,
  getPopoverPaperStyles,
  getProfileDrawerPaperStyles,
  getSymbolLogoStyles,
  logoLinkStyles,
} from './LoggedInHeader.styles';

export type LoggedInHeaderProfileType =
  | 'individual'
  | 'corporate'
  | 'law-firm'
  | 'title-insurance'
  | 'title-search'
  | 'notary'
  | 'title-co'
  | 'licensee-account'
  | 'super-admin';

export type LoggedInHeaderBreakpoint = 'mobile' | 'tablet' | 'desktop';

export interface LoggedInHeaderProps {
  profileType?: LoggedInHeaderProfileType;
  impersonating?: boolean;
  userName?: string;
  userEmail?: string;
  breakpoint?: LoggedInHeaderBreakpoint;
  onMenuClick?: () => void;
  drawerActiveItem?: string;
  hideActions?: boolean;
  hideMenuButton?: boolean;
  disableSettings?: boolean;
  disableScheduleClosing?: boolean;
  homeHref?: string;
  fullLogoSrc?: string;
  symbolLogoSrc?: string;
}

interface ProfileConfig {
  badgeBg: string;
  badgeColor: string;
  linkLabel: string;
}

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  disabled?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

function getProfileConfig(theme: Theme): Record<string, ProfileConfig> {
  const staffConfig = {
    badgeBg: theme.colors.teal[100],
    badgeColor: theme.colors.teal[700],
    linkLabel: 'View Staff',
  };

  return {
    corporate: staffConfig,
    'law-firm': staffConfig,
    'title-insurance': staffConfig,
    'title-search': staffConfig,
    notary: staffConfig,
    'title-co': staffConfig,
    'licensee-account': staffConfig,
    'super-admin': {
      badgeBg: theme.colors.red[100],
      badgeColor: theme.colors.red[700],
      linkLabel: 'View All Users',
    },
  };
}

function SvgIcon({ size = 20, color = 'currentColor', children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ color, flexShrink: 0 }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ stroke?: string; fill?: string }>, {
              stroke: (child.props as { stroke?: string }).stroke ?? color,
              fill: (child.props as { fill?: string }).fill ?? 'none',
            })
          : child
      )}
    </svg>
  );
}

function EmailInviteIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 6.5H20V17.5H4V6.5Z" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4.75 7.25L12 12.75L19.25 7.25" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M18 4V9" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 6.5H20.5" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function NotificationIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M18 10.2V14.5L19.5 17H4.5L6 14.5V10.2C6 6.9 8.4 4.5 12 4.5C15.6 4.5 18 6.9 18 10.2Z" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.75 19C10.25 20 10.95 20.5 12 20.5C13.05 20.5 13.75 20 14.25 19" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function MenuIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 7H20M4 12H20M4 17H20" strokeWidth="2" strokeLinecap="round" />
    </SvgIcon>
  );
}

function AccessibilityAltIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 5.5C12.55 5.5 13 5.05 13 4.5C13 3.95 12.55 3.5 12 3.5C11.45 3.5 11 3.95 11 4.5C11 5.05 11.45 5.5 12 5.5Z" fill="currentColor" />
      <path d="M5 8.5H19M12 8.5V20M8.5 20L12 13L15.5 20" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  );
}

function LogoutIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10 5H5V19H10" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 8L17 12L13 16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 12H9" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function MeterIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4.5 15.5A7.5 7.5 0 1 1 19.5 15.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 15L16 10" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function PipelineIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M5 7H9.5V11.5H5V7ZM14.5 12.5H19V17H14.5V12.5Z" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 9.25H12C13.38 9.25 14.5 10.37 14.5 11.75V14.75" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function UserMultipleIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M9.5 11C11.16 11 12.5 9.66 12.5 8C12.5 6.34 11.16 5 9.5 5C7.84 5 6.5 6.34 6.5 8C6.5 9.66 7.84 11 9.5 11Z" strokeWidth="1.8" />
      <path d="M4.5 19C4.9 16.4 6.65 15 9.5 15C12.35 15 14.1 16.4 14.5 19" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 6.25C16.4 6.55 17.25 7.55 17.25 9C17.25 10.45 16.4 11.45 15 11.75M16.5 14.8C18.3 15.35 19.35 16.75 19.5 19" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function ViewingModeBadge({ config }: { config: ProfileConfig }) {
  return (
    <>
      <LIViewingDesktopBox sx={{ display: { xs: 'none', md: 'flex' } }}>
        <LIViewingPill style={{ backgroundColor: config.badgeBg }}>
          <ViewFilledIcon size={16} color={config.badgeColor} />
          <LIViewingText component="span" badgeColor={config.badgeColor}>
            Viewing Mode
          </LIViewingText>
        </LIViewingPill>
        <LIViewingLink href="#">{config.linkLabel}</LIViewingLink>
      </LIViewingDesktopBox>
      <LIViewingMobilePill
        sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        style={{ backgroundColor: config.badgeBg }}
      >
        <ViewFilledIcon size={16} color={config.badgeColor} />
        <ChevronDownIcon size={16} color={config.badgeColor} />
      </LIViewingMobilePill>
    </>
  );
}

function DropdownItem({ icon, label, onClick, trailing, disabled }: DropdownItemProps) {
  if (trailing) {
    return (
      <LIDropdownItem component="div" onClick={disabled ? undefined : onClick}>
        <LIDropdownIconBox>{icon}</LIDropdownIconBox>
        <LIDropdownLabel>{label}</LIDropdownLabel>
        {trailing}
      </LIDropdownItem>
    );
  }

  return (
    <LIDropdownItemBtn
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      isDisabled={disabled}
    >
      <LIDropdownIconBox>{icon}</LIDropdownIconBox>
      <LIDropdownLabel>{label}</LIDropdownLabel>
    </LIDropdownItemBtn>
  );
}

function DrawerNav({
  items,
  activeItem,
  onItemClick,
}: {
  items: NavItem[];
  activeItem: string;
  onItemClick: () => void;
}) {
  return (
    <LINavDrawerList>
      {items.map((item) => (
        <LINavDrawerItem
          key={item.id}
          isActive={item.id === activeItem}
          onClick={onItemClick}
        >
          {item.icon}
          <LINavDrawerItemLabel>{item.label}</LINavDrawerItemLabel>
        </LINavDrawerItem>
      ))}
    </LINavDrawerList>
  );
}

export default function LoggedInHeader({
  profileType = 'individual',
  impersonating = false,
  userName = 'Larry Thompson',
  userEmail = 'larry@email.com',
  breakpoint,
  onMenuClick,
  drawerActiveItem = 'dashboard',
  hideActions = false,
  hideMenuButton = false,
  disableSettings = false,
  disableScheduleClosing = false,
  homeHref = '/',
  fullLogoSrc = '/logos/logo-full-blue.svg',
  symbolLogoSrc = '/logos/logo-symbol-blue.svg',
}: LoggedInHeaderProps) {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const darkMode = colorMode === 'dark';
  const menuOpen = Boolean(menuAnchor);

  const showDesktopTablet = breakpoint ? (breakpoint !== 'mobile' ? 'flex' : 'none') : undefined;
  const showMobile = breakpoint ? (breakpoint === 'mobile' ? 'flex' : 'none') : undefined;
  const showDesktopOnly = breakpoint ? (breakpoint === 'desktop' ? 'inline-flex' : 'none') : undefined;
  const showTabletOnly = breakpoint ? (breakpoint === 'tablet' ? 'flex' : 'none') : undefined;

  const profileConfigMap = useMemo(() => getProfileConfig(theme), [theme]);
  const profileConfig = impersonating ? profileConfigMap[profileType] : null;
  const popoverPaperSx = useMemo(() => getPopoverPaperStyles(theme, darkMode), [theme, darkMode]);
  const navDrawerPaperSx = useMemo(() => getNavDrawerPaperStyles(theme), [theme]);
  const profileDrawerPaperSx = useMemo(() => getProfileDrawerPaperStyles(theme), [theme]);
  const fullLogoStyles = useMemo(() => getFullLogoStyles(darkMode), [darkMode]);
  const symbolLogoStyles = useMemo(() => getSymbolLogoStyles(darkMode), [darkMode]);

  const navItems = useMemo<NavItem[]>(() => [
    { id: 'dashboard', label: 'Dashboard', icon: <MeterIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'documents', label: 'My Documents', icon: <DocumentViewIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'pipeline', label: 'Pipeline', icon: <PipelineIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'calendar', label: 'Calendar', icon: <EventScheduleIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'connections', label: 'Connections', icon: <UserMultipleIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsAdjustIcon size={20} color={theme.semantic.text.primary} /> },
  ], [theme]);

  const handleToggleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor((prev) => (prev ? null : event.currentTarget));
  }, []);
  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);
  const handleCloseProfileDrawer = useCallback(() => setProfileDrawerOpen(false), []);

  const profileMenu = (
    <>
      <DropdownItem
        icon={<SettingsAdjustIcon size={20} color={theme.semantic.text.primary} />}
        label="Settings"
        onClick={handleCloseMenu}
        disabled={disableSettings}
      />
      <DropdownItem
        icon={<MoonFilledIcon size={20} color={theme.semantic.text.primary} />}
        label="Dark Mode"
        trailing={<Toggle checked={darkMode} onChange={toggleColorMode} size="sm" />}
        onClick={toggleColorMode}
      />
      <DropdownItem
        icon={<AccessibilityAltIcon size={20} color={theme.semantic.text.primary} />}
        label="Accessibility Options"
        onClick={handleCloseMenu}
      />
      <DropdownItem
        icon={<LogoutIcon size={20} color={theme.semantic.text.primary} />}
        label="Logout"
        onClick={handleCloseMenu}
      />
    </>
  );

  return (
    <LIAppBar position="sticky" elevation={0}>
      <LIOuterContainer maxWidth={false}>
        <LIToolbar disableGutters>
          <LIDesktopTabletRow sx={{ display: showDesktopTablet ?? { xs: 'none', md: 'flex' } }}>
            <LILeftBox>
              <Box component="a" href={homeHref} sx={logoLinkStyles}>
                <Box
                  component="img"
                  src={fullLogoSrc}
                  alt="Schedule Closings"
                  sx={{ ...fullLogoStyles, display: showDesktopOnly ?? { md: 'none', lg: 'block' } }}
                />
                <Box
                  component="img"
                  src={symbolLogoSrc}
                  alt="Schedule Closings"
                  sx={{ ...symbolLogoStyles, display: showTabletOnly ?? { md: 'block', lg: 'none' } }}
                />
              </Box>
              {profileConfig && <ViewingModeBadge config={profileConfig} />}
            </LILeftBox>

            <LIRightBox>
              {!hideActions && (
                <>
                  <BaseButton
                    variant="outline"
                    color="secondary"
                    endIcon={<EmailInviteIcon />}
                    sx={{ display: showDesktopOnly ?? { md: 'none', lg: 'inline-flex' } }}
                  >
                    Send Invite
                  </BaseButton>
                  <LISendInviteIconBtn
                    aria-label="Send invite"
                    sx={{ display: showTabletOnly ?? { md: 'flex', lg: 'none' } }}
                  >
                    <EmailInviteIcon color={theme.semantic.secondary.main} />
                  </LISendInviteIconBtn>

                  <BaseButton
                    variant="filled"
                    color="primary"
                    endIcon={<AddIcon />}
                    disabled={disableScheduleClosing}
                    sx={{ display: showDesktopOnly ?? { md: 'none', lg: 'inline-flex' } }}
                  >
                    Schedule Closing
                  </BaseButton>
                  <LIScheduleClosingIconBtn
                    aria-label="Schedule closing"
                    disabled={disableScheduleClosing}
                    sx={{ display: showTabletOnly ?? { md: 'flex', lg: 'none' } }}
                  >
                    <AddIcon color={theme.semantic.primary.contrastText} />
                  </LIScheduleClosingIconBtn>

                  <LIResourcesIconBtn aria-label="Resources">
                    <DocumentViewIcon color={theme.semantic.text.secondary} />
                  </LIResourcesIconBtn>
                  <LINotificationsIconBtn data-walkthrough-id="header-notifications" aria-label="Notifications">
                    <NotificationIcon size={24} color={theme.semantic.text.secondary} />
                  </LINotificationsIconBtn>
                </>
              )}

              <LIProfileButton
                component="button"
                onClick={handleToggleMenu}
                aria-label="Account menu"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <ImagePlaceholder placeholderType="Initials" name={userName} alt={userName} shape="Circle" size={32} />
                {menuOpen
                  ? <ChevronUpIcon size={20} color={theme.semantic.text.primary} />
                  : <ChevronDownIcon size={20} color={theme.semantic.text.primary} />}
              </LIProfileButton>
            </LIRightBox>
          </LIDesktopTabletRow>

          <LIMobileRow sx={{ display: showMobile ?? { xs: 'flex', md: 'none' } }}>
            <LIMobileLeftCol>
              {!hideMenuButton && (
                <LIHamburgerBtn
                  aria-label="Open menu"
                  onClick={() => (onMenuClick ? onMenuClick() : setNavDrawerOpen(true))}
                >
                  <MenuIcon size={24} color={theme.semantic.text.primary} />
                </LIHamburgerBtn>
              )}
              {profileConfig && <ViewingModeBadge config={profileConfig} />}
            </LIMobileLeftCol>

            <Box component="a" href={homeHref} sx={logoLinkStyles}>
              <Box component="img" src={symbolLogoSrc} alt="Schedule Closings" sx={symbolLogoStyles} />
            </Box>

            <LIMobileRightCol>
              {!hideActions && (
                <LIMobileNotificationsBtn aria-label="Notifications">
                  <NotificationIcon size={24} color={theme.semantic.text.secondary} />
                </LIMobileNotificationsBtn>
              )}
              <LIProfileButton
                component="button"
                onClick={() => setProfileDrawerOpen(true)}
                aria-label="Open profile"
                aria-haspopup="true"
              >
                <ImagePlaceholder placeholderType="Initials" name={userName} alt={userName} shape="Circle" size={32} />
              </LIProfileButton>
            </LIMobileRightCol>
          </LIMobileRow>
        </LIToolbar>
      </LIOuterContainer>

      <Popover
        open={menuOpen}
        anchorEl={menuAnchor}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: popoverPaperSx } }}
      >
        <LIProfileHeaderBox>
          <ImagePlaceholder placeholderType="Initials" name={userName} alt={userName} shape="Circle" size={72} />
          <LIProfileTextCol>
            <LIProfileNameText>{userName}</LIProfileNameText>
            <LIProfileEmailText>{userEmail}</LIProfileEmailText>
          </LIProfileTextCol>
        </LIProfileHeaderBox>
        <LIDividerBox />
        <LIMenuItemsBox>{profileMenu}</LIMenuItemsBox>
      </Popover>

      {!onMenuClick && (
        <Drawer
          anchor="left"
          open={navDrawerOpen}
          onClose={() => setNavDrawerOpen(false)}
          PaperProps={{ sx: navDrawerPaperSx }}
        >
          <DrawerNav
            items={navItems}
            activeItem={drawerActiveItem}
            onItemClick={() => setNavDrawerOpen(false)}
          />
        </Drawer>
      )}

      <Drawer
        anchor="right"
        open={profileDrawerOpen}
        onClose={handleCloseProfileDrawer}
        PaperProps={{ sx: profileDrawerPaperSx }}
      >
        <LIDrawerColumnBox>
          <LIDrawerCloseBar>
            <LICloseIconBtn aria-label="Close profile" onClick={handleCloseProfileDrawer}>
              <CloseIcon size={20} color={theme.semantic.text.secondary} />
            </LICloseIconBtn>
          </LIDrawerCloseBar>
          <LIDrawerProfileHeaderBox>
            <ImagePlaceholder placeholderType="Initials" name={userName} alt={userName} shape="Circle" size={72} />
            <LIProfileTextCol>
              <LIProfileNameText>{userName}</LIProfileNameText>
              <LIProfileEmailText>{userEmail}</LIProfileEmailText>
            </LIProfileTextCol>
          </LIDrawerProfileHeaderBox>
          <LIDrawerDividerBox />
          <LIDrawerMenuItemsBox>{profileMenu}</LIDrawerMenuItemsBox>
        </LIDrawerColumnBox>
      </Drawer>
    </LIAppBar>
  );
}
