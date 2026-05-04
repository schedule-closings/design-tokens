'use client';

/**
 * CompanySwitcher — Company selection dropdown.
 * Source: Figma file TWQldwrvmJkRDbLk7a9FAg, node 2487-51492
 *
 * Shows the current company with logo + name + chevron. Clicking opens a
 * dropdown listing all companies with the selected one highlighted. Includes
 * an "All Companies" option and an "Add Company" action.
 *
 * Props:
 *   companies       — CompanyOption[]  — list of available companies
 *   selectedId      — string | null    — currently selected company id (null = "All Companies")
 *   onSelect        — func            — (id: string | null) => void
 *   onViewPage      — func            — called when "View Page" is clicked
 *   onAddCompany    — func            — called when "Add Company" is clicked
 *   showAllOption   — bool            — show "All Companies" option (default true)
 *   sx              — SxProps         — outer wrapper overrides
 */

import React, { useState, useRef, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import ImagePlaceholder from './ImagePlaceholder';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  AddIcon,
} from './icons';
import { BuildingFilledIcon } from './icons/BuildingFilledIcon';
import { CheckmarkOutlineIcon } from './icons/CheckmarkOutlineIcon';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import {
  CSwitcherRoot,
  CSwitcherTrigger,
  CSwitcherAllIconBox,
  CSwitcherNameCol,
  CSwitcherNameRow,
  CSwitcherChevronBox,
  CSwitcherNameText,
  CSwitcherViewLink,
  CSwitcherOption,
  CSwitcherSmallAllBox,
  CSwitcherOptionText,
  CSwitcherAddIconBox,
  CSwitcherAddText,
  CSwitcherAddOption,
} from './CompanySwitcher.styles';

// Types

export interface CompanyOption {
  id: string;
  name: string;
  type?: string;    // e.g. "Law Firm", "Title Search"
  logo?: string;    // image URL
}

export interface CompanySwitcherProps {
  companies?: CompanyOption[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onViewPage?: () => void;
  onAddCompany?: () => void;
  showAllOption?: boolean;
  sx?: SxProps<Theme>;
}

// Component

export default function CompanySwitcher({
  companies = [],
  selectedId = null,
  onSelect,
  onViewPage,
  onAddCompany,
  showAllOption = false,
  sx,
}: CompanySwitcherProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Read color mode from closest ancestor so the portal-rendered dropdown inherits it
  const [colorMode, setColorMode] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (triggerRef.current) {
      const mode = triggerRef.current.closest('[data-color-mode]')?.getAttribute('data-color-mode');
      setColorMode(mode ?? undefined);
    }
  });

  const selected = selectedId ? companies.find((c) => c.id === selectedId) : null;
  const displayName = selected?.name ?? 'All Companies';
  const displayType = selected?.type ? `${selected.type} · ` : '';
  const isAllSelected = !selectedId;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (id: string | null) => { onSelect?.(id); handleClose(); };

  return (
    <CSwitcherRoot sx={sx}>
      {/* ── Trigger row ── */}
      <CSwitcherTrigger ref={triggerRef} onClick={handleOpen}>
        {isAllSelected ? (
          <CSwitcherAllIconBox>
            <BuildingFilledIcon size={24} color={theme.semantic.text.secondary} />
          </CSwitcherAllIconBox>
        ) : (
          <ImagePlaceholder
            placeholderType="Initials"
            name={displayName}
            src={selected?.logo}
            shape="RoundedSquare"
            size={48}
          />
        )}

        <CSwitcherNameCol>
          <CSwitcherNameRow>
            <CSwitcherNameText>{displayName}</CSwitcherNameText>
            <CSwitcherChevronBox>
              {open
                ? <ChevronUpIcon size={20} color={theme.semantic.text.primary} />
                : <ChevronDownIcon size={20} color={theme.semantic.text.primary} />}
            </CSwitcherChevronBox>
          </CSwitcherNameRow>
          <CSwitcherViewLink
            isAllSelected={isAllSelected}
            onClick={(e: React.MouseEvent) => {
              if (!isAllSelected && onViewPage) { e.stopPropagation(); onViewPage(); }
            }}
          >
            {displayType}View Page
          </CSwitcherViewLink>
        </CSwitcherNameCol>
      </CSwitcherTrigger>

      {/* ── Dropdown ── */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            ...(colorMode ? { 'data-color-mode': colorMode } : {}),
            sx: {
              mt: theme.customSpacing[1],
              borderRadius: theme.customBorderRadius.xl,
              border: `1px solid ${theme.semantic.divider}`,
              boxShadow: colorMode === 'dark'
                ? '0 4px 12px rgba(0,0,0,0.4), 0 12px 28px rgba(0,0,0,0.35)'
                : theme.customShadows.lg,
              bgcolor: theme.semantic.common.white,
              backgroundImage: theme.surfaceOverlay.base,
              p: theme.customSpacing[3],
              width: 272,
              display: 'flex',
              flexDirection: 'column',
            },
          } as Record<string, unknown>,
        }}
      >
        {/* "All Companies" option */}
        {showAllOption && (
          <CSwitcherOption isSelected={isAllSelected} onClick={() => handleSelect(null)}>
            <CSwitcherSmallAllBox>
              <BuildingFilledIcon size={16} color={theme.semantic.text.secondary} />
            </CSwitcherSmallAllBox>
            <CSwitcherOptionText isSelected={isAllSelected}>All Companies</CSwitcherOptionText>
            {isAllSelected && <CheckmarkOutlineIcon size={20} color={theme.semantic.primary.main} />}
          </CSwitcherOption>
        )}

        {/* Company list */}
        {companies.map((company) => {
          const isSelected = selectedId === company.id;
          return (
            <CSwitcherOption key={company.id} isSelected={isSelected} onClick={() => handleSelect(company.id)}>
              <ImagePlaceholder
                placeholderType="Initials"
                name={company.name}
                src={company.logo}
                shape="RoundedSquare"
                size={32}
              />
              <CSwitcherOptionText isSelected={isSelected}>{company.name}</CSwitcherOptionText>
              {isSelected && <CheckmarkOutlineIcon size={20} color={theme.semantic.primary.main} />}
            </CSwitcherOption>
          );
        })}

        {/* Add Company */}
        {onAddCompany && (
          <CSwitcherAddOption onClick={() => { onAddCompany(); handleClose(); }}>
            <CSwitcherAddIconBox>
              <AddIcon size={16} color={theme.semantic.primary.main} />
            </CSwitcherAddIconBox>
            <CSwitcherAddText>Add Company</CSwitcherAddText>
          </CSwitcherAddOption>
        )}
      </Popover>
    </CSwitcherRoot>
  );
}
