'use client';

/**
 * SideNav — Collapsible side navigation with account-type variants.
 * Source: Figma file TWQldwrvmJkRDbLk7a9FAg, node 210-1104
 *
 * Two states: expanded (320px, full labels) and collapsed (96px, icon-only).
 * A 24px chevron toggle sits on the right edge. Navigation items are fully
 * configurable via the `navItems` prop array.
 *
 * Account type variants:
 *   super-admin       — No company section; View Staff or ImpersonationBanner; user profile
 *   customer          — User avatar + name + "View All Profiles" link; role selector dropdown
 *   law-firm / title-insurance / title-search / notary / corporate
 *                     — Full company section; optional SetupCard; View Staff or ImpersonationBanner; user profile
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import SmoothBox from './SmoothBox';
import ImagePlaceholder from './ImagePlaceholder';
import CounterBadge from './CounterBadge';
import IconTooltip from './IconTooltip';
import Tooltip from './Tooltip';
import CompanySwitcher from './CompanySwitcher';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckmarkFilledIcon,
  AlertFilledIcon,
} from './icons';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { CircleOutlineIcon } from './icons/CircleOutlineIcon';
import ProfileSwitcherField from './ProfileSwitcherField';
import { useTheme } from '@mui/material/styles';
import {
  NavToggleButton,
  NavItemExpandedBtn,
  NavItemIconBox,
  NavItemLabel,
  NavItemCollapsedBtn,
  NavItemCollapsedIconBox,
  ImpersonationBannerBox,
  ImpersonationTextCol,
  ImpersonationAdminLabel,
  ImpersonationAdminName,
  ImpersonationExitBox,
  SetupCardTitle,
  SetupProgressBox,
  SetupProgressNumberRow,
  SetupProgressNumber,
  SetupProgressLabel,
  SetupDotsRow,
  SetupDotIconBox,
  SetupDotInteractiveBtn,
  SetupButton,
  ViewStaffBtn,
  ViewStaffLabel,
  ProfileRowBox,
  ProfileTextCol,
  ProfileNameText,
  ProfileRoleText,
  CompanySectionRow,
  CompanyTextCol,
  CompanyNameBtn,
  CompanyNameText,
  CompanyViewLinkRow,
  CompanyViewLink,
  CustomerTopBox,
  CustomerAvatarRow,
  CustomerTextCol,
  CustomerNameText,
  CustomerViewLink,
  NavDivider,
  SideNavFooterBox,
  SideNavVersionText,
  SideNavLegalText,
  CollapsedAdminRing,
  CollapsedImpersonationCol,
  SideNavRoot,
  CollapsedItemRelativeBox,
  CollapsedBadgePosition,
  SideNavExpandedPanel,
  SideNavCollapsedPanel,
  SideNavNavList,
  SideNavCollapsedNavList,
  SideNavTopSection,
} from './SideNav.styles';

// Types

/**
 * Flat union of every concrete account type. Groups into three categories
 * via `getAccountCategory`:
 *   - individual: customer, real-estate-agent, closing-coordinator, lender, loan-processor
 *   - csp:        law-firm, title-insurance, title-search, notary, corporate
 *   - super-admin: super-admin
 *
 * For Individual and CSP, the sidenav surfaces the profile (not roles — those
 * are transaction-scoped). Super Admin has no profile layer, so the sidenav
 * shows the role directly via `userRole`.
 */
export type AccountType =
  | 'super-admin'
  | 'law-firm'
  | 'title-insurance'
  | 'title-search'
  | 'notary'
  | 'corporate'
  | 'customer'
  | 'real-estate-agent'
  | 'closing-coordinator'
  | 'lender'
  | 'loan-processor';

export type AccountCategory = 'individual' | 'csp' | 'super-admin';

const INDIVIDUAL_ACCOUNT_TYPES: AccountType[] = [
  'customer',
  'real-estate-agent',
  'closing-coordinator',
  'lender',
  'loan-processor',
];

const CSP_TYPES_FOR_CATEGORY: AccountType[] = [
  'law-firm',
  'title-insurance',
  'title-search',
  'notary',
  'corporate',
];

/** Derive the account category (Individual / CSP / Super Admin) from a concrete account type. */
export function getAccountCategory(accountType: AccountType): AccountCategory {
  if (INDIVIDUAL_ACCOUNT_TYPES.includes(accountType)) return 'individual';
  if (CSP_TYPES_FOR_CATEGORY.includes(accountType)) return 'csp';
  return 'super-admin';
}

/** Human-readable label for each individual profile. */
const INDIVIDUAL_PROFILE_LABELS: Record<string, string> = {
  'customer': 'Customer',
  'real-estate-agent': 'Real Estate Agent',
  'closing-coordinator': 'Closing Coordinator',
  'lender': 'Lender',
  'loan-processor': 'Loan Processor',
};

export interface IndividualProfileChild {
  id: string;
  label: string;
}

export interface IndividualProfileOption {
  /** Stable id — typically the same string as the AccountType. */
  id: string;
  /** Display label (e.g. "Customer", "Real Estate Agent"). */
  label: string;
  /** Optional muted count shown after the label as "(N)". */
  count?: number;
  /** Optional icon override. Defaults to UserProfileAltIcon. */
  icon?: React.ReactNode;
  /**
   * Named sub-profiles when the user has multiple profiles of this type. The
   * switcher renders each parent with children as a hover-to-expand group;
   * selection happens on the child.
   */
  children?: IndividualProfileChild[];
}

export interface SideNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

/**
 * Review/completion status of a single setup checklist item. Mirrors the icon
 * logic used inside CSPChecklistModal so the banner's dots stay in sync:
 *   - 'incomplete'      → outline circle (gray)
 *   - 'pending-review'  → filled check (gray) — CSP filled it in, waiting on SA
 *   - 'approved'        → filled check (green) — SA marked approved
 *   - 'needs-revision'  → filled alert (yellow) — SA requested changes
 */
export type SetupChecklistItemStatus =
  | 'incomplete'
  | 'pending-review'
  | 'approved'
  | 'needs-revision';

/**
 * Minimal checklist item used by the setup banner's progress dots. Mirrors the
 * order of items shown in the corresponding checklist modal (e.g. CSPChecklistModal)
 * so each dot represents a real item and can deep-link into that sub-view.
 */
export interface SetupChecklistItem {
  /** Stable id, matching the modal's item id so it can be passed through as `initialActiveItemId`. */
  id: string;
  /** Human-readable label shown in the dot's tooltip on hover. */
  label: string;
  /** Review/completion status. Defaults to 'incomplete' when omitted. */
  status?: SetupChecklistItemStatus;
  /** @deprecated Legacy flag — true maps to 'pending-review'. Prefer `status`. */
  completed?: boolean;
}

export interface SideNavProps {
  expanded?: boolean;
  onToggleExpand?: () => void;
  navItems?: SideNavItem[];
  activeItem?: string;
  onNavItemClick?: (id: string) => void;
  companyName?: string;
  companyType?: string;
  companyLogo?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  onViewStaff?: () => void;
  companies?: { id: string; name: string; type?: string; logo?: string }[];
  onCompanySelect?: (id: string | null) => void;
  onCompanyClick?: () => void;
  onViewPage?: () => void;
  onAddCompany?: () => void;
  version?: string;
  onVersionClick?: () => void;
  sx?: object;
  // New props
  accountType?: AccountType;
  impersonationMode?: boolean;
  adminName?: string;
  adminAvatar?: string;
  onExitImpersonation?: () => void;
  liveStatus?: boolean;
  setupProgress?: number;
  setupTotal?: number;
  onCompleteSetup?: () => void;
  /**
   * Items to mirror in the setup banner's progress dots, in display order.
   * When provided, each dot gets a tooltip of the item's label on hover and a
   * click handler that fires `onChecklistItemClick(item.id)`. If omitted, the
   * banner falls back to decorative dots driven by `setupTotal` + `setupProgress`.
   */
  checklistItems?: SetupChecklistItem[];
  /** Fired when a banner dot (mirroring a `checklistItems` entry) is clicked. */
  onChecklistItemClick?: (itemId: string) => void;
  onViewAllProfiles?: () => void;
  /**
   * @deprecated Use `profileOptions` + `selectedProfileId` instead. Kept so
   * existing callers continue to render a static "Customer" label.
   */
  customerRole?: string;
  /**
   * Individual-account profile options (Customer, Real Estate Agent, Closing
   * Coordinator, Lender, Loan Processor). When multiple entries are provided,
   * the top section renders a profile selector chip; one entry renders as a
   * static label. Ignored for CSP and Super Admin accounts.
   */
  profileOptions?: IndividualProfileOption[];
  /** Currently-selected profile id. Defaults to the first option. */
  selectedProfileId?: string;
  onProfileSelect?: (id: string) => void;
  /** Handler for the "File Starter" dropdown entry. When omitted, the row is hidden. */
  onViewFileStarter?: () => void;
  /** Handler for the "Add Profile +" dropdown entry. When omitted, the row is hidden. */
  onAddProfile?: () => void;
}

// Constants

// CSP account types that show the CompanySwitcher
const CSP_ACCOUNT_TYPES: AccountType[] = ['law-firm', 'title-insurance', 'title-search', 'notary'];

// Default sample companies for CSP accounts (used when no `companies` prop is provided)
const DEFAULT_CSP_COMPANIES = [
  { id: 'abc-law', name: 'ABC Law Firm', type: 'Law Firm' },
  { id: 'abc-ts', name: 'ABC Title Search', type: 'Title Search' },
  { id: 'abc-ti', name: 'ABC Title Insurance', type: 'Title Insurance' },
  { id: 'abc-notary', name: 'ABC Notary Charlotte Services Group', type: 'Notary' },
];

// User profile per company (simulates role/identity switching for prototypes).
// The primary company ('abc-law') intentionally has no entry so the caller's
// userName/userRole props win — this keeps the SideNav profile in sync with
// the Header user dropdown on the default dashboard view. The other companies
// represent distinct identities you'd switch *into* and keep their own name.
const DEFAULT_COMPANY_PROFILES: Record<string, { userName: string; userRole: string }> = {
  'abc-ts': { userName: 'Maria Santos', userRole: 'Title Search Rep' },
  'abc-ti': { userName: 'James White', userRole: 'Title Ins Admin' },
  'abc-notary': { userName: 'Rachel Kim', userRole: 'Notary Rep' },
};

const EXPANDED_WIDTH = 320;
const COLLAPSED_WIDTH = 96;
const ICON_SIZE = 20;
const AVATAR_SIZE = 48;
const ADMIN_AVATAR_SIZE = 40;

// Toggle button

function ToggleButton({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  const theme = useTheme();
  const Icon = expanded ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <NavToggleButton onClick={onClick} aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}>
      <Icon size={12} color={theme.semantic.text.secondary} />
    </NavToggleButton>
  );
}

// Expanded nav item

function NavItemExpanded({
  item,
  isActive,
  onClick,
}: {
  item: SideNavItem;
  isActive: boolean;
  onClick?: (id: string) => void;
}) {
  return (
    <NavItemExpandedBtn
      data-walkthrough-id={`sidenav-nav-${item.id}`}
      isActive={isActive}
      onClick={() => onClick?.(item.id)}
    >
      <NavItemIconBox isActive={isActive}>{item.icon}</NavItemIconBox>
      <NavItemLabel isActive={isActive}>{item.label}</NavItemLabel>
      {item.badge != null && item.badge > 0 && (
        <CounterBadge count={item.badge} variant="square" size="md" />
      )}
    </NavItemExpandedBtn>
  );
}

// Collapsed nav item

function NavItemCollapsed({
  item,
  isActive,
  onClick,
}: {
  item: SideNavItem;
  isActive: boolean;
  onClick?: (id: string) => void;
}) {
  return (
    <CollapsedItemRelativeBox>
      <NavItemCollapsedBtn
        data-walkthrough-id={`sidenav-nav-${item.id}`}
        isActive={isActive}
        onClick={() => onClick?.(item.id)}
        aria-label={item.label}
      >
        <NavItemCollapsedIconBox isActive={isActive}>{item.icon}</NavItemCollapsedIconBox>
      </NavItemCollapsedBtn>
      {item.badge != null && item.badge > 0 && (
        <CollapsedBadgePosition>
          <CounterBadge count={item.badge} variant="square" size="md" />
        </CollapsedBadgePosition>
      )}
    </CollapsedItemRelativeBox>
  );
}

// Sub-component: ImpersonationBanner

function ImpersonationBanner({
  adminName,
  adminAvatar,
  onExitImpersonation,
}: {
  adminName: string;
  adminAvatar?: string;
  onExitImpersonation?: () => void;
}) {
  const theme = useTheme();
  return (
    <ImpersonationBannerBox>
      <ImagePlaceholder
        placeholderType="Initials"
        name={adminName}
        src={adminAvatar}
        alt={adminName}
        shape="Circle"
        size={ADMIN_AVATAR_SIZE}
      />
      <ImpersonationTextCol>
        <ImpersonationAdminLabel>LOGGED IN AS ADMIN</ImpersonationAdminLabel>
        <ImpersonationAdminName>{adminName}</ImpersonationAdminName>
      </ImpersonationTextCol>
      <ImpersonationExitBox>
        <IconTooltip
          title="Exit Impersonation"
          icon={<LogoutIcon />}
          size={24}
          color={theme.semantic.error.main}
          placement="top"
        />
      </ImpersonationExitBox>
    </ImpersonationBannerBox>
  );
}

// Sub-component: SetupCard

function SetupCard({
  setupProgress = 0,
  setupTotal = 0,
  onCompleteSetup,
  checklistItems,
  onChecklistItemClick,
}: {
  setupProgress?: number;
  setupTotal?: number;
  onCompleteSetup?: () => void;
  checklistItems?: SetupChecklistItem[];
  onChecklistItemClick?: (itemId: string) => void;
}) {
  const theme = useTheme();

  // When `checklistItems` is provided, it's the source of truth for both the
  // dot count and the "N of X" readout — each dot mirrors a real item so its
  // tooltip and click handler can reference the underlying id.
  const hasItems = Array.isArray(checklistItems) && checklistItems.length > 0;
  const total = hasItems ? checklistItems!.length : setupTotal;

  // Normalize each item's status once so counts and dot icons stay consistent.
  const resolvedItems = hasItems
    ? checklistItems!.map((it): { id: string; label: string; status: SetupChecklistItemStatus } => ({
        id: it.id,
        label: it.label,
        status: it.status ?? (it.completed ? 'pending-review' : 'incomplete'),
      }))
    : [];

  // Only items that the Super Admin has marked 'approved' count toward the
  // headline "N of X" readout — Pending Review, Incomplete, and Needs Revision
  // all leave the counter unchanged. The compact banner can't fit the full
  // breakdown the modal shows, so we surface approval status alone and rely on
  // the per-dot icon to communicate the other states at a glance.
  const completed = hasItems
    ? resolvedItems.filter((it) => it.status === 'approved').length
    : setupProgress;

  const progressLabel = hasItems ? 'Reviewed & Completed' : 'Required Items Completed';

  return (
    <SmoothBox
      data-walkthrough-id="sidenav-setup-banner"
      smoothRadius={theme.customBorderRadius.xl}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.customSpacing[3],
        width: '100%',
        pt: theme.customSpacing[3],
        pb: theme.customSpacing[4],
        px: theme.customSpacing[4],
        border: `1px solid ${theme.semantic.alert.main}`,
      }}
    >
      <SetupCardTitle>Closing Service Provider Setup</SetupCardTitle>

      <SetupProgressBox>
        <SetupProgressNumberRow>
          <SetupProgressNumber>{completed} of {total}</SetupProgressNumber>
          {hasItems ? (
            <IconTooltip
              placement="right"
              size={16}
              title={
                // Tooltip background is a dark slate, so the "gray" banner icons
                // (pending-review, incomplete) get brightened here for contrast.
                // Green and yellow already read fine against dark.
                (() => {
                  const tooltipGray = theme.colors.slate[300];
                  return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 220 }}>
                      <Box sx={{ fontWeight: 600 }}>What counts here</Box>
                      <Box>
                        Only items marked Reviewed & Completed by Schedule Closings count toward the total.
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <CheckmarkFilledIcon size={16} color={theme.semantic.success.main} />
                          <span>Reviewed & Completed</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <AlertFilledIcon size={16} color={theme.semantic.alert.main} />
                          <span>Needs Revision</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <CheckmarkFilledIcon size={16} color={tooltipGray} />
                          <span>Pending Review</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <CircleOutlineIcon size={16} color={tooltipGray} />
                          <span>Incomplete</span>
                        </Box>
                      </Box>
                    </Box>
                  );
                })()
              }
            />
          ) : null}
        </SetupProgressNumberRow>
        <SetupProgressLabel>{progressLabel}</SetupProgressLabel>
      </SetupProgressBox>

      <SetupDotsRow>
        {hasItems
          ? resolvedItems.map((item) => {
              // Icon + color per status — matches CSPChecklistModal's per-item
              // glyph so a glance at the banner matches what the modal shows.
              let IconNode: React.ReactElement;
              switch (item.status) {
                case 'approved':
                  IconNode = <CheckmarkFilledIcon size={20} color={theme.semantic.success.main} />;
                  break;
                case 'needs-revision':
                  IconNode = <AlertFilledIcon size={20} color={theme.semantic.alert.main} />;
                  break;
                case 'pending-review':
                  IconNode = <CheckmarkFilledIcon size={20} color={theme.semantic.text.secondary} />;
                  break;
                default:
                  IconNode = <CircleOutlineIcon size={20} color={theme.semantic.text.secondary} />;
              }
              return (
                <Tooltip key={item.id} title={item.label} placement="top">
                  <SetupDotInteractiveBtn
                    onClick={() => onChecklistItemClick?.(item.id)}
                    aria-label={item.label}
                  >
                    {IconNode}
                  </SetupDotInteractiveBtn>
                </Tooltip>
              );
            })
          : Array.from({ length: total }, (_, i) => {
              const isCompleted = i < completed;
              return (
                <SetupDotIconBox key={i}>
                  <CircleOutlineIcon
                    size={20}
                    color={isCompleted ? theme.semantic.alert.main : theme.semantic.text.secondary}
                  />
                </SetupDotIconBox>
              );
            })}
      </SetupDotsRow>

      <SetupButton onClick={onCompleteSetup}>
        Complete to Go Live
      </SetupButton>
    </SmoothBox>
  );
}

// Expanded: ViewStaff chip

function ViewStaffChip({ onViewStaff }: { onViewStaff?: () => void }) {
  const theme = useTheme();
  return (
    <ViewStaffBtn onClick={onViewStaff}>
      <UserGroupIcon size={ICON_SIZE} color={theme.semantic.text.primary} />
      <ViewStaffLabel>View Staff</ViewStaffLabel>
    </ViewStaffBtn>
  );
}

// Expanded: Profile row

function ProfileRow({
  userName,
  userRole,
  userAvatar,
}: {
  userName: string;
  userRole: string;
  userAvatar?: string;
}) {
  return (
    <ProfileRowBox>
      <ImagePlaceholder
        placeholderType="Initials"
        name={userName}
        src={userAvatar}
        alt={userName}
        shape="Circle"
        size={AVATAR_SIZE}
      />
      <ProfileTextCol>
        <ProfileNameText>{userName}</ProfileNameText>
        <ProfileRoleText>{userRole}</ProfileRoleText>
      </ProfileTextCol>
    </ProfileRowBox>
  );
}

// Expanded: Company section

function CompanySection({
  companyName,
  companyType,
  companyLogo,
  onCompanyClick,
  onViewPage,
}: {
  companyName: string;
  companyType: string;
  companyLogo?: string;
  onCompanyClick?: () => void;
  onViewPage?: () => void;
}) {
  return (
    <CompanySectionRow>
      <ImagePlaceholder
        placeholderType="Initials"
        name={companyName}
        src={companyLogo}
        alt={companyName}
        shape="RoundedSquare"
        size={AVATAR_SIZE}
      />
      <CompanyTextCol>
        <CompanyNameBtn onClick={onCompanyClick}>
          <CompanyNameText>{companyName}</CompanyNameText>
          <ChevronDownIcon size={ICON_SIZE} color="var(--sc-text-primary)" />
        </CompanyNameBtn>
        <CompanyViewLinkRow>
          <CompanyViewLink onClick={onViewPage}>
            {companyType}{companyType ? ' \u00B7 ' : ''}View Page
          </CompanyViewLink>
        </CompanyViewLinkRow>
      </CompanyTextCol>
    </CompanySectionRow>
  );
}

// Expanded: Individual top section (profile switcher via ProfileSwitcherField)

function IndividualTopSection({
  userName,
  userAvatar,
  profileOptions,
  selectedProfileId,
  isImpersonated,
  onProfileSelect,
  onViewAllProfiles,
  onViewFileStarter,
  onAddProfile,
}: {
  userName: string;
  userAvatar?: string;
  profileOptions: IndividualProfileOption[];
  /** Raw selected id — may be a parent type or a named child sub-profile. */
  selectedProfileId: string | null;
  /** During impersonation the chip renders in the muted (slate) state and cannot be clicked. */
  isImpersonated: boolean;
  onProfileSelect?: (id: string) => void;
  onViewAllProfiles?: () => void;
  onViewFileStarter?: () => void;
  onAddProfile?: () => void;
}) {
  // Memoize: the ProfileSwitcherField is memoized and receives this array;
  // without useMemo it got a new reference every render and lost its bailout.
  const switcherOptions = useMemo(
    () => profileOptions.map((p) => ({
      value: p.id,
      label: p.label,
      count: p.count,
      children: p.children?.map((c) => ({ value: c.id, label: c.label })),
    })),
    [profileOptions],
  );
  return (
    <CustomerTopBox>
      <CustomerAvatarRow>
        <ImagePlaceholder
          placeholderType="Initials"
          name={userName}
          src={userAvatar}
          alt={userName}
          shape="Circle"
          size={AVATAR_SIZE}
        />
        <CustomerTextCol>
          <CustomerNameText>{userName}</CustomerNameText>
          <CustomerViewLink onClick={onViewAllProfiles}>View All Profiles</CustomerViewLink>
        </CustomerTextCol>
      </CustomerAvatarRow>

      <ProfileSwitcherField
        value={selectedProfileId}
        options={switcherOptions}
        impersonated={isImpersonated}
        onChange={onProfileSelect}
        onViewAllProfiles={onViewAllProfiles}
        onViewFileStarter={onViewFileStarter}
        onAddProfile={onAddProfile}
      />
    </CustomerTopBox>
  );
}

// Sub-component: IndividualImpersonationChip — small red chip shown above the
// avatar row when an Individual account is being impersonated.
function IndividualImpersonationChip({
  adminName,
  adminAvatar,
  onExitImpersonation,
}: {
  adminName: string;
  adminAvatar?: string;
  onExitImpersonation?: () => void;
}) {
  const theme = useTheme();
  return (
    <ImpersonationBannerBox>
      <ImagePlaceholder
        placeholderType="Initials"
        name={adminName}
        src={adminAvatar}
        alt={adminName}
        shape="Circle"
        size={ADMIN_AVATAR_SIZE}
      />
      <ImpersonationTextCol>
        <ImpersonationAdminLabel>LOGGED IN AS ADMIN</ImpersonationAdminLabel>
        <ImpersonationAdminName>{adminName}</ImpersonationAdminName>
      </ImpersonationTextCol>
      <ImpersonationExitBox>
        <IconTooltip
          title="Exit Impersonation"
          icon={<LogoutIcon />}
          size={24}
          color={theme.semantic.error.main}
          placement="top"
        />
      </ImpersonationExitBox>
    </ImpersonationBannerBox>
  );
}

// Divider

function Divider() {
  return <NavDivider />;
}

// Footer

function SideNavFooter({ version, onVersionClick }: { version: string; onVersionClick?: () => void }) {
  return (
    <SideNavFooterBox>
      <SideNavVersionText isClickable={Boolean(onVersionClick)} onClick={onVersionClick}>
        Schedule Closings vER {version}
      </SideNavVersionText>
      <SideNavLegalText>Privacy Policy &middot; Terms of Use</SideNavLegalText>
    </SideNavFooterBox>
  );
}

// Main component

export default function SideNav({
  expanded = true,
  onToggleExpand,
  companyName = '',
  companyType = '',
  companyLogo,
  userName = '',
  userRole = '',
  userAvatar,
  navItems = [],
  activeItem,
  onNavItemClick,
  onViewStaff,
  companies = [],
  onCompanySelect,
  onCompanyClick,
  onViewPage,
  onAddCompany,
  version = '1.0.0',
  onVersionClick,
  sx,
  accountType = 'law-firm',
  impersonationMode = false,
  adminName = '',
  adminAvatar,
  onExitImpersonation,
  liveStatus = true,
  setupProgress = 0,
  setupTotal = 0,
  onCompleteSetup,
  checklistItems,
  onChecklistItemClick,
  onViewAllProfiles,
  customerRole,
  profileOptions,
  selectedProfileId,
  onProfileSelect,
  onViewFileStarter,
  onAddProfile,
}: SideNavProps) {
  const handleToggle = useCallback(() => onToggleExpand?.(), [onToggleExpand]);

  // CompanySwitcher: for CSP accounts, manage internal company selection state
  const isCSP = CSP_ACCOUNT_TYPES.includes(accountType);
  const resolvedCompanies = companies.length > 0 ? companies : (isCSP ? DEFAULT_CSP_COMPANIES : []);
  const [internalSelectedCompany, setInternalSelectedCompany] = useState<string | null>(
    resolvedCompanies.length > 0 ? resolvedCompanies[0].id : null
  );
  const selectedCompanyId = internalSelectedCompany;
  const handleCompanySelect = useCallback((id: string | null) => {
    setInternalSelectedCompany(id);
    onCompanySelect?.(id);
  }, [onCompanySelect]);

  // Derive display name/type/profile from selected company
  const selectedCompanyObj = resolvedCompanies.find((c) => c.id === selectedCompanyId);
  const resolvedCompanyName = selectedCompanyObj?.name ?? companyName;
  const resolvedCompanyType = selectedCompanyObj?.type ?? companyType;
  const defaultProfile = selectedCompanyId ? DEFAULT_COMPANY_PROFILES[selectedCompanyId] : null;
  const resolvedUserName = defaultProfile?.userName ?? userName;
  const resolvedUserRole = defaultProfile?.userRole ?? userRole;

  // Delayed render state: keeps previous content visible during crossfade
  const [showExpanded, setShowExpanded] = useState(expanded);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    // Delay swapping DOM content until width is mostly done
    const swapTimer = setTimeout(() => setShowExpanded(expanded), 150);
    const doneTimer = setTimeout(() => setAnimating(false), 350);
    return () => {
      clearTimeout(swapTimer);
      clearTimeout(doneTimer);
    };
  }, [expanded]);

  const accountCategory = getAccountCategory(accountType);
  const isSuperAdmin = accountCategory === 'super-admin';
  const isIndividual = accountCategory === 'individual';
  const isStandardAccount = accountCategory === 'csp';

  // Individual profile resolution. Treat `customerRole` (legacy) as a single-
  // profile fallback; otherwise derive the default label from the accountType
  // (e.g. 'real-estate-agent' → 'Real Estate Agent').
  const resolvedProfileOptions: IndividualProfileOption[] = profileOptions ?? [{
    id: accountType,
    label: customerRole ?? INDIVIDUAL_PROFILE_LABELS[accountType] ?? 'Profile',
  }];
  // `selectedProfileId` may reference either a top-level profile type id or a
  // child (named sub-profile) id. Resolve to the parent option either way so
  // the chip always shows the profile type label.
  const selectedProfileOption =
    resolvedProfileOptions.find((p) => p.id === selectedProfileId)
    ?? resolvedProfileOptions.find((p) => p.children?.some((c) => c.id === selectedProfileId))
    ?? resolvedProfileOptions[0];

  // Impersonation or View Staff section
  const renderStaffOrImpersonation = () => {
    if (impersonationMode) {
      return (
        <ImpersonationBanner
          adminName={adminName}
          adminAvatar={adminAvatar}
          onExitImpersonation={onExitImpersonation}
        />
      );
    }
    return <ViewStaffChip onViewStaff={onViewStaff} />;
  };

  // Expanded top section based on accountType
  const renderExpandedTopSection = () => {
    if (isIndividual) {
      return (
        <SideNavTopSection>
          {/* Impersonation chip sits above the avatar for Individual accounts
              (unlike CSP where it sits between SetupCard and Profile row). */}
          {impersonationMode && (
            <IndividualImpersonationChip
              adminName={adminName}
              adminAvatar={adminAvatar}
              onExitImpersonation={onExitImpersonation}
            />
          )}
          <IndividualTopSection
            userName={userName}
            userAvatar={userAvatar}
            profileOptions={resolvedProfileOptions}
            selectedProfileId={selectedProfileId ?? selectedProfileOption.id}
            isImpersonated={impersonationMode}
            onProfileSelect={onProfileSelect}
            onViewAllProfiles={onViewAllProfiles}
            onViewFileStarter={onViewFileStarter}
            onAddProfile={onAddProfile}
          />
        </SideNavTopSection>
      );
    }

    if (isSuperAdmin) {
      return (
        <SideNavTopSection>
          {/* No company section for super-admin */}
          {renderStaffOrImpersonation()}
          <ProfileRow userName={userName} userRole={userRole} userAvatar={userAvatar} />
        </SideNavTopSection>
      );
    }

    // Standard account types (law-firm, title-insurance, title-search, notary, corporate)
    return (
      <SideNavTopSection>
        {/* Company switcher (CSP accounts) or static company section */}
        {resolvedCompanies.length > 0 ? (
          <CompanySwitcher
            companies={resolvedCompanies}
            selectedId={selectedCompanyId}
            onSelect={handleCompanySelect}
            onViewPage={onViewPage}
            onAddCompany={onAddCompany}
            sx={{ width: '100%' }}
          />
        ) : (
          <CompanySection
            companyName={resolvedCompanyName}
            companyType={resolvedCompanyType}
            companyLogo={companyLogo}
            onCompanyClick={onCompanyClick}
            onViewPage={onViewPage}
          />
        )}

        {/* Setup card (only when not live). Renders above the divider per
            Figma, then the divider separates it from the staff/impersonation
            chip below. When live, the divider still separates the company
            block from the chip. */}
        {liveStatus === false && (
          <SetupCard
            setupProgress={setupProgress}
            setupTotal={setupTotal}
            onCompleteSetup={onCompleteSetup}
            checklistItems={checklistItems}
            onChecklistItemClick={onChecklistItemClick}
          />
        )}

        <Divider />

        {/* View Staff chip or Impersonation banner */}
        {renderStaffOrImpersonation()}

        {/* Profile row — uses resolved values from CompanySwitcher selection */}
        <ProfileRow userName={resolvedUserName} userRole={resolvedUserRole} userAvatar={userAvatar} />
      </SideNavTopSection>
    );
  };

  // Collapsed top section based on accountType
  const renderCollapsedTopSection = () => {
    if (isIndividual) {
      // Show user avatar at top instead of company logo
      return (
        <ImagePlaceholder
          placeholderType="Initials"
          name={userName}
          src={userAvatar}
          alt={userName}
          shape="Circle"
          size={AVATAR_SIZE}
          sx={{ flexShrink: 0 }}
        />
      );
    }

    if (isSuperAdmin && impersonationMode) {
      // Show admin avatar with red ring border
      return (
        <CollapsedAdminRing sx={{ flexShrink: 0 }}>
          <ImagePlaceholder
            placeholderType="Initials"
            name={adminName}
            src={adminAvatar}
            alt={adminName}
            shape="Circle"
            size={ADMIN_AVATAR_SIZE - 4}
          />
        </CollapsedAdminRing>
      );
    }

    if (isSuperAdmin) {
      // No company logo for super-admin, show user avatar
      return (
        <ImagePlaceholder
          placeholderType="Initials"
          name={userName}
          src={userAvatar}
          alt={userName}
          shape="Circle"
          size={AVATAR_SIZE}
          sx={{ flexShrink: 0 }}
        />
      );
    }

    // Standard: impersonation mode in collapsed shows admin avatar with red ring
    if (impersonationMode) {
      return (
        <CollapsedImpersonationCol>
          <ImagePlaceholder
            placeholderType="Initials"
            name={companyName}
            src={companyLogo}
            alt={companyName}
            shape="RoundedSquare"
            size={AVATAR_SIZE}
          />
          <CollapsedAdminRing>
            <ImagePlaceholder
              placeholderType="Initials"
              name={adminName}
              src={adminAvatar}
              alt={adminName}
              shape="Circle"
              size={ADMIN_AVATAR_SIZE - 4}
            />
          </CollapsedAdminRing>
        </CollapsedImpersonationCol>
      );
    }

    // Standard collapsed: company logo only
    return (
      <ImagePlaceholder
        placeholderType="Initials"
        name={companyName}
        src={companyLogo}
        alt={companyName}
        shape="RoundedSquare"
        size={AVATAR_SIZE}
        sx={{ flexShrink: 0 }}
      />
    );
  };

  return (
    <SideNavRoot
      component="nav"
      isExpanded={expanded}
      isAnimating={animating}
      sx={sx}
    >
      {/* ── Toggle chevron (hidden when no onToggleExpand, e.g. inside a Drawer) ── */}
      {onToggleExpand && <ToggleButton expanded={expanded} onClick={handleToggle} />}

      {showExpanded ? (
        /* ━━━ EXPANDED STATE ━━━ */
        <SideNavExpandedPanel isAnimating={animating}>
          {/* ── Top section (account-type dependent) ── */}
          {renderExpandedTopSection()}

          {/* ── Nav links ── */}
          <SideNavNavList>
            {navItems.map((item) => (
              <NavItemExpanded
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={onNavItemClick}
              />
            ))}
          </SideNavNavList>

          {/* ── Footer ── */}
          <SideNavFooter version={version} onVersionClick={onVersionClick} />
        </SideNavExpandedPanel>
      ) : (
        /* ━━━ COLLAPSED STATE ━━━ */
        <SideNavCollapsedPanel isAnimating={animating}>
          {/* Top section (account-type dependent) */}
          {renderCollapsedTopSection()}

          {/* Icon-only nav */}
          <SideNavCollapsedNavList>
            {navItems.map((item) => (
              <NavItemCollapsed
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={onNavItemClick}
              />
            ))}
          </SideNavCollapsedNavList>
        </SideNavCollapsedPanel>
      )}
    </SideNavRoot>
  );
}
