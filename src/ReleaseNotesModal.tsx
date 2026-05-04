'use client';

/**
 * ReleaseNotesModal — "What's New" modal triggered from the SideNav version text.
 *
 * Displays a user-friendly, tester-oriented changelog with sections:
 * Overview (date + summary), What's New, Improvements, Bug Fixes.
 * Each section uses a table layout with colored label cells.
 */

import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Modal from './Modal';
import Chip from './Chip';
import SelectField from './SelectField';
import BaseButton from './BaseButton';
import { releaseNotes } from './ReleaseNotesModal.data';
import type { ReleaseEntry, ReleaseItem } from './ReleaseNotesModal.data';
import {
  SectionWrapper,
  SectionHeading,
  TableContainer,
  TableRow,
  LabelCell,
  LabelText,
  DescriptionCell,
  DescriptionText,
  ReleaseBlockRoot,
  VersionHeaderRow,
  OverviewSectionWrapper,
  OverviewHeading,
  OverviewTableContainer,
  OverviewRow,
  OverviewLabelCell,
  OverviewLabelText,
  OverviewValueCell,
  OverviewValueText,
  ActionsSpacer,
} from './ReleaseNotesModal.styles';

// Props

export interface ReleaseNotesModalProps {
  open: boolean;
  onClose: () => void;
}

// Table section

interface SectionTableProps {
  emoji: string;
  title: string;
  items: ReleaseItem[];
  labelBg: string;
  labelColor: string;
  borderColor: string;
}

function SectionTable({ emoji, title, items, labelBg, labelColor, borderColor }: SectionTableProps) {
  if (items.length === 0) return null;
  return (
    <SectionWrapper>
      {/* Section heading */}
      <SectionHeading>
        {emoji} {title}
      </SectionHeading>

      {/* Table */}
      <TableContainer borderColor={borderColor}>
        {items.map((item, i) => (
          <TableRow key={i} borderColor={borderColor} isLast={i === items.length - 1}>
            {/* Label cell */}
            <LabelCell labelBg={labelBg} borderColor={borderColor}>
              <LabelText labelColor={labelColor}>
                {item.label}
              </LabelText>
            </LabelCell>

            {/* Description cell */}
            <DescriptionCell>
              <DescriptionText>
                {item.description}
              </DescriptionText>
            </DescriptionCell>
          </TableRow>
        ))}
      </TableContainer>
    </SectionWrapper>
  );
}

// Single release block

function ReleaseBlock({ entry, isLatest }: { entry: ReleaseEntry; isLatest: boolean }) {
  const theme = useTheme();
  return (
    <ReleaseBlockRoot>
      {/* Version header */}
      <VersionHeaderRow>
        <Chip label={`v${entry.version}`} style="duotone" color={isLatest ? 'new' : 'default'} size="mid" bold />
        {isLatest && <Chip label="Latest" style="duotone" color="success" size="small" />}
      </VersionHeaderRow>

      {/* Overview table */}
      <OverviewSectionWrapper>
        <OverviewHeading>
          Overview
        </OverviewHeading>
        <OverviewTableContainer>
          {/* Date row */}
          <OverviewRow hasBorder>
            <OverviewLabelCell>
              <OverviewLabelText>Date</OverviewLabelText>
            </OverviewLabelCell>
            <OverviewValueCell>
              <OverviewValueText>{entry.date}</OverviewValueText>
            </OverviewValueCell>
          </OverviewRow>
          {/* Summary row */}
          <OverviewRow>
            <OverviewLabelCell>
              <OverviewLabelText>Summary</OverviewLabelText>
            </OverviewLabelCell>
            <OverviewValueCell>
              <OverviewValueText>{entry.summary}</OverviewValueText>
            </OverviewValueCell>
          </OverviewRow>
        </OverviewTableContainer>
      </OverviewSectionWrapper>

      {/* What's New — pages, prototypes, flows */}
      <SectionTable
        emoji="🎉"
        title="What's new!"
        items={entry.whatsNew}
        labelBg={theme.colors.green[50]}
        labelColor={theme.colors.green[700]}
        borderColor={theme.colors.green[200]}
      />

      {/* Design System Tooling — components, tokens */}
      <SectionTable
        emoji="🧩"
        title="Design System Tooling"
        items={entry.designSystem}
        labelBg={theme.colors.purple[50]}
        labelColor={theme.colors.purple[700]}
        borderColor={theme.colors.purple[200]}
      />

      {/* Improvements */}
      <SectionTable
        emoji="⭐"
        title="Improvements"
        items={entry.improvements}
        labelBg={theme.colors.yellow[50]}
        labelColor={theme.colors.yellow[700]}
        borderColor={theme.colors.yellow[200]}
      />

      {/* Bug Fixes */}
      <SectionTable
        emoji="🐛"
        title="Bug fixes"
        items={entry.bugFixes}
        labelBg={theme.colors.red[50]}
        labelColor={theme.colors.red[700]}
        borderColor={theme.colors.red[200]}
      />
    </ReleaseBlockRoot>
  );
}

// Version options for SelectField

const VERSION_OPTIONS = releaseNotes.map((e) => ({
  value: e.version,
  label: `v${e.version} — ${e.date}`,
}));

// Component

export default function ReleaseNotesModal({ open, onClose }: ReleaseNotesModalProps) {
  const [activeVersion, setActiveVersion] = useState(releaseNotes[0]?.version ?? '');
  const activeEntry = releaseNotes.find((e) => e.version === activeVersion) ?? releaseNotes[0];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Release Notes"
      layout="sectioned"
      maxWidth="75vw"
      sx={{ height: '80vh' }}
      actions={
        <>
          <SelectField
            variant="outline"
            size="small"
            value={activeVersion}
            onChange={setActiveVersion}
            options={VERSION_OPTIONS}
            sx={{ minWidth: 220 }}
          />
          <ActionsSpacer />
          <BaseButton variant="filled" color="primary" onClick={onClose}>
            Got it
          </BaseButton>
        </>
      }
    >
      {/* Content — scrolls within the sectioned modal */}
      {activeEntry && (
        <ReleaseBlock
          entry={activeEntry}
          isLatest={activeEntry.version === releaseNotes[0]?.version}
        />
      )}
    </Modal>
  );
}
