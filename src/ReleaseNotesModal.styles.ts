'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ---------------------------------------------------------------------------
// SectionTable styles
// ---------------------------------------------------------------------------

export const SectionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
}));

export const SectionHeading = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.h6.bold,
  color: theme.semantic.text.primary,
}));

const TABLE_BORDER_PROPS = ['borderColor'] as const;

export const TableContainer = styled(Box, {
  shouldForwardProp: (prop) => !(TABLE_BORDER_PROPS as readonly string[]).includes(prop as string),
})<{ borderColor: string }>(({ theme, borderColor }) => ({
  border: `1px solid ${borderColor}`,
  borderRadius: theme.customBorderRadius.lg,
  overflow: 'hidden',
}));

const TABLE_ROW_PROPS = ['borderColor', 'isLast'] as const;

export const TableRow = styled(Box, {
  shouldForwardProp: (prop) => !(TABLE_ROW_PROPS as readonly string[]).includes(prop as string),
})<{ borderColor: string; isLast: boolean }>(({ borderColor, isLast }) => ({
  display: 'flex',
  borderBottom: isLast ? 'none' : `1px solid ${borderColor}`,
  minHeight: 44,
}));

const LABEL_CELL_PROPS = ['labelBg', 'borderColor'] as const;

export const LabelCell = styled(Box, {
  shouldForwardProp: (prop) => !(LABEL_CELL_PROPS as readonly string[]).includes(prop as string),
})<{ labelBg: string; borderColor: string }>(({ theme, labelBg, borderColor }) => ({
  width: 160,
  flexShrink: 0,
  backgroundColor: labelBg,
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  display: 'flex',
  alignItems: 'center',
  borderRight: `1px solid ${borderColor}`,
}));

const LABEL_TEXT_PROPS = ['labelColor'] as const;

export const LabelText = styled(Typography, {
  shouldForwardProp: (prop) => !(LABEL_TEXT_PROPS as readonly string[]).includes(prop as string),
})<{ labelColor: string }>(({ theme, labelColor }) => ({
  ...theme.customTypography.body2.semibold,
  color: labelColor,
}));

export const DescriptionCell = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  display: 'flex',
  alignItems: 'center',
}));

export const DescriptionText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.primary,
}));

// ---------------------------------------------------------------------------
// ReleaseBlock styles
// ---------------------------------------------------------------------------

export const ReleaseBlockRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[5],
}));

export const VersionHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.customSpacing[2],
  flexWrap: 'wrap',
}));

export const OverviewSectionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[3],
}));

export const OverviewHeading = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.h6.bold,
  color: theme.semantic.text.primary,
}));

export const OverviewTableContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.colors.blue[200]}`,
  borderRadius: theme.customBorderRadius.lg,
  overflow: 'hidden',
}));

const OVERVIEW_ROW_PROPS = ['hasBorder'] as const;

export const OverviewRow = styled(Box, {
  shouldForwardProp: (prop) => !(OVERVIEW_ROW_PROPS as readonly string[]).includes(prop as string),
})<{ hasBorder?: boolean }>(({ theme, hasBorder }) => ({
  display: 'flex',
  minHeight: 44,
  ...(hasBorder && {
    borderBottom: `1px solid ${theme.colors.blue[200]}`,
  }),
}));

export const OverviewLabelCell = styled(Box)(({ theme }) => ({
  width: 160,
  flexShrink: 0,
  backgroundColor: theme.colors.blue[50],
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  display: 'flex',
  alignItems: 'center',
  borderRight: `1px solid ${theme.colors.blue[200]}`,
}));

export const OverviewLabelText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.semibold,
  color: theme.semantic.primary.main,
}));

export const OverviewValueCell = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingLeft: theme.customSpacing[3],
  paddingRight: theme.customSpacing[3],
  paddingTop: theme.customSpacing[2],
  paddingBottom: theme.customSpacing[2],
  display: 'flex',
  alignItems: 'center',
}));

export const OverviewValueText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.regular,
  color: theme.semantic.text.primary,
}));

// ---------------------------------------------------------------------------
// Main modal — actions row spacer
// ---------------------------------------------------------------------------

export const ActionsSpacer = styled(Box)({
  flex: 1,
});
