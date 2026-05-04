'use client';

import React, { useState } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import LoggedInHeader from './LoggedInHeader';
import type { LoggedInHeaderProfileType } from './LoggedInHeader';
import SideNav from './SideNav';
import type { AccountType, SideNavProps } from './SideNav';
import ReleaseNotesModal from './ReleaseNotesModal';
import {
  AppDrawer,
  BodyInner,
  BodyWrapper,
  ContentMain,
  HeaderWrapper,
  ShellRoot,
  SideNavDesktop,
} from './AppShell.styles';

export interface AppShellProps {
  /** Profile type passed to the logged-in header. */
  headerProfileType?: LoggedInHeaderProfileType;
  /** When true, the header shows the "Viewing Mode" impersonation badge. */
  headerImpersonating?: boolean;
  /** Optional header user name. Defaults to sidenavProps.userName when omitted. */
  headerUserName?: string;
  /** Optional header user email. */
  headerUserEmail?: string;
  /** Disables the Schedule Closing button in the header. */
  disableScheduleClosing?: boolean;
  /** Props spread onto SideNav. AppShell owns the SideNav sx. */
  sidenavProps: Omit<SideNavProps, 'sx'>;
  /** Main content container overrides. */
  contentSx?: SxProps<Theme>;
  /** Body row overrides for outer padding and gap. */
  bodyInnerSx?: SxProps<Theme>;
  /** Content rendered inside the main content container. */
  children: React.ReactNode;
}

function toHeaderProfileType(
  accountType: AccountType | undefined,
): LoggedInHeaderProfileType | undefined {
  if (!accountType) return undefined;
  if (
    accountType === 'law-firm' ||
    accountType === 'title-search' ||
    accountType === 'title-insurance' ||
    accountType === 'notary' ||
    accountType === 'corporate' ||
    accountType === 'super-admin'
  ) {
    return accountType;
  }
  if (accountType === 'customer') return 'individual';
  return 'individual';
}

export default function AppShell({
  headerProfileType,
  headerImpersonating = false,
  headerUserName,
  headerUserEmail,
  disableScheduleClosing = false,
  sidenavProps,
  contentSx,
  bodyInnerSx,
  children,
}: AppShellProps) {
  const theme = useTheme();
  const [sidenavExpanded, setSidenavExpanded] = useState(
    sidenavProps.expanded ?? true,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);

  const resolvedHeaderProfileType =
    headerProfileType ||
    toHeaderProfileType(sidenavProps.accountType) ||
    'law-firm';

  return (
    <ShellRoot>
      <HeaderWrapper>
        <LoggedInHeader
          profileType={resolvedHeaderProfileType}
          impersonating={headerImpersonating}
          userName={headerUserName ?? sidenavProps.userName}
          userEmail={headerUserEmail}
          onMenuClick={() => setDrawerOpen(true)}
          disableScheduleClosing={disableScheduleClosing}
        />
      </HeaderWrapper>

      <BodyWrapper>
        <BodyInner sx={bodyInnerSx}>
          <SideNavDesktop>
            <SideNav
              {...sidenavProps}
              expanded={sidenavExpanded}
              onToggleExpand={() => setSidenavExpanded((previous) => !previous)}
              onVersionClick={() => setReleaseNotesOpen(true)}
              sx={{
                borderRadius: theme.customBorderRadius.xl,
                border: `1px solid ${theme.semantic.divider}`,
                boxShadow: 'var(--sc-panel-shadow)',
              }}
            />
          </SideNavDesktop>

          <ContentMain
            component="main"
            smoothRadius={theme.customBorderRadius.xl}
            sx={contentSx}
          >
            {children}
          </ContentMain>
        </BodyInner>
      </BodyWrapper>

      <AppDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <SideNav
          {...sidenavProps}
          expanded
          onNavItemClick={(id: string) => {
            sidenavProps.onNavItemClick?.(id);
            setDrawerOpen(false);
          }}
          onVersionClick={() => setReleaseNotesOpen(true)}
          sx={{ height: '100%', width: '100%' }}
        />
      </AppDrawer>

      <ReleaseNotesModal
        open={releaseNotesOpen}
        onClose={() => setReleaseNotesOpen(false)}
      />
    </ShellRoot>
  );
}
