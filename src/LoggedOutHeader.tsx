'use client';

import { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useTheme } from '@mui/material/styles';
import BaseButton from './BaseButton';
import { useColorMode } from './ColorModeContext';
import { CloseIcon } from './icons';
import {
  LOAppBar,
  LOContainer,
  LOCTAsBox,
  LODrawerCloseButton,
  LODrawerCTAsBox,
  LODrawerCTAButton,
  LODrawerDivider,
  LODrawerHeaderBox,
  LODrawerLogoImg,
  LODrawerNavBox,
  LODrawerPaperStyles,
  LOHamburgerButton,
  LOLoginButton,
  LOLogoImg,
  LOLogoLink,
  LONavButton,
  LONavLinksBox,
  LORightBox,
  LOToolbar,
} from './LoggedOutHeader.styles';

const DEFAULT_ASSETS = {
  svLogo: '/logos/logo-full-blue.svg',
  svLogoDark: '/logos/logo-full-white.svg',
};

export type LoggedOutHeaderBreakpoint = 'mobile' | 'tablet' | 'desktop';

export interface LoggedOutHeaderProps {
  breakpoint?: LoggedOutHeaderBreakpoint;
  activePath?: string;
  navBasePath?: string;
  logoHref?: string;
  logoSrc?: string;
  logoDarkSrc?: string;
  logoAlt?: string;
  registerHref?: string;
  loginHref?: string;
  onCreateAccount?: () => void;
  onLogin?: () => void;
}

export default function LoggedOutHeader({
  breakpoint,
  activePath,
  navBasePath = '',
  logoHref = '/',
  logoSrc = DEFAULT_ASSETS.svLogo,
  logoDarkSrc = DEFAULT_ASSETS.svLogoDark,
  logoAlt = 'Schedule Closings',
  registerHref = '/register',
  loginHref = '/login',
  onCreateAccount,
  onLogin,
}: LoggedOutHeaderProps = {}) {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { colorMode } = useColorMode();
  const resolvedLogoSrc = colorMode === 'dark' ? logoDarkSrc : logoSrc;

  const navActiveSx = useMemo(() => ({
    bgcolor: theme.colors.blue[50],
    color: theme.semantic.primary.main,
    '[data-color-mode="dark"] &': {
      bgcolor: theme.semantic.action.selected,
      color: theme.colors.white,
    },
    '&:hover': {
      bgcolor: theme.colors.blue[50],
      '[data-color-mode="dark"] &': { bgcolor: theme.semantic.action.selected },
    },
  }), [theme]);

  const drawerPaperSx = useMemo(() => LODrawerPaperStyles(theme), [theme]);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);

  const showNavLinks = breakpoint ? (breakpoint === 'desktop' ? 'flex' : 'none') : undefined;
  const showCTAs = breakpoint ? (breakpoint !== 'mobile' ? 'flex' : 'none') : undefined;
  const showHamburger = breakpoint ? (breakpoint !== 'desktop' ? 'flex' : 'none') : undefined;

  const handleDrawerCreateAccount = useCallback(() => {
    setDrawerOpen(false);
    onCreateAccount?.();
  }, [onCreateAccount]);

  const handleDrawerLogin = useCallback(() => {
    setDrawerOpen(false);
    onLogin?.();
  }, [onLogin]);

  return (
    <>
      <LOAppBar position="sticky" elevation={0}>
        <LOContainer maxWidth={false}>
          <LOToolbar>
            <LOLogoLink href={logoHref}>
              <LOLogoImg
                src={resolvedLogoSrc}
                alt={logoAlt}
              />
            </LOLogoLink>

            <LORightBox>
              <LONavLinksBox sx={{ display: showNavLinks ?? { xs: 'none', lg: 'flex' } }}>
                <LONavButton
                  variant="ghost"
                  color="neutral"
                  component="a"
                  href={`${navBasePath}/company`}
                  sx={activePath === '/company' ? navActiveSx : undefined}
                >
                  Company
                </LONavButton>
                <LONavButton
                  variant="ghost"
                  color="neutral"
                  component="a"
                  href={`${navBasePath}/investor-relations`}
                  sx={activePath === '/investor-relations' ? navActiveSx : undefined}
                >
                  Investor Relations
                </LONavButton>
                <LONavButton
                  variant="ghost"
                  color="neutral"
                  component="a"
                  href={`${navBasePath}/help-center`}
                  sx={activePath === '/help-center' ? navActiveSx : undefined}
                >
                  Help Center
                </LONavButton>
              </LONavLinksBox>

              <LOCTAsBox sx={{ display: showCTAs ?? { xs: 'none', md: 'flex' } }}>
                <BaseButton
                  variant="outline"
                  color="secondary"
                  component="a"
                  href={onCreateAccount ? undefined : registerHref}
                  onClick={onCreateAccount}
                >
                  Create Account
                </BaseButton>
                <LOLoginButton
                  variant="filled"
                  color="primary"
                  component="a"
                  href={onLogin ? undefined : loginHref}
                  onClick={onLogin}
                >
                  Login
                </LOLoginButton>
              </LOCTAsBox>

              <LOHamburgerButton
                onClick={openDrawer}
                sx={{ display: showHamburger ?? { xs: 'flex', lg: 'none' } }}
                aria-label="Open navigation menu"
              >
                <MenuRoundedIcon sx={{ fontSize: 24 }} />
              </LOHamburgerButton>
            </LORightBox>
          </LOToolbar>
        </LOContainer>
      </LOAppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        PaperProps={{
          sx: drawerPaperSx,
        }}
      >
        <LODrawerHeaderBox>
          <Box component="a" href={logoHref} onClick={closeDrawer}>
            <LODrawerLogoImg
              src={resolvedLogoSrc}
              alt={logoAlt}
            />
          </Box>
          <LODrawerCloseButton
            onClick={closeDrawer}
            aria-label="Close navigation menu"
          >
            <CloseIcon size={24} color="currentColor" />
          </LODrawerCloseButton>
        </LODrawerHeaderBox>

        <LODrawerNavBox>
          <LONavButton
            variant="ghost"
            color="neutral"
            component="a"
            href={`${navBasePath}/company`}
            sx={activePath === '/company' ? navActiveSx : undefined}
            onClick={closeDrawer}
          >
            Company
          </LONavButton>
          <LONavButton
            variant="ghost"
            color="neutral"
            component="a"
            href={`${navBasePath}/investor-relations`}
            sx={activePath === '/investor-relations' ? navActiveSx : undefined}
            onClick={closeDrawer}
          >
            Investor Relations
          </LONavButton>
          <LONavButton
            variant="ghost"
            color="neutral"
            component="a"
            href={`${navBasePath}/help-center`}
            sx={activePath === '/help-center' ? navActiveSx : undefined}
            onClick={closeDrawer}
          >
            Help Center
          </LONavButton>
        </LODrawerNavBox>

        <LODrawerDivider />

        <LODrawerCTAsBox>
          <LODrawerCTAButton
            variant="outline"
            color="secondary"
            component="a"
            href={onCreateAccount ? undefined : registerHref}
            onClick={onCreateAccount ? handleDrawerCreateAccount : closeDrawer}
          >
            Create Account
          </LODrawerCTAButton>
          <LODrawerCTAButton
            variant="filled"
            color="primary"
            component="a"
            href={onLogin ? undefined : loginHref}
            onClick={onLogin ? handleDrawerLogin : closeDrawer}
          >
            Login
          </LODrawerCTAButton>
        </LODrawerCTAsBox>
      </Drawer>
    </>
  );
}
