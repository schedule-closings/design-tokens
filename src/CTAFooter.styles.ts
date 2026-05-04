'use client';

import type React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const shouldForwardProp = (prop: string) => prop !== 'isDark';

export const WavesContainer = styled(Box)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  maskImage:
    'radial-gradient(ellipse at 80% 20%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
  WebkitMaskImage:
    'radial-gradient(ellipse at 80% 20%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
});

export const SectionRoot = styled(Box, { shouldForwardProp })<
  { isDark?: boolean } & { component?: React.ElementType }
>(({ theme, isDark }) => ({
  paddingTop: theme.customSpacing[12],
  paddingBottom: theme.customSpacing[12],
  paddingLeft: theme.customSpacing[5],
  paddingRight: theme.customSpacing[5],
  background: isDark
    ? theme.colors.slate[950]
    : `color-mix(in srgb, ${theme.colors.blue[950]} 40%, ${theme.colors.slate[950]})`,
  position: 'relative',
  overflow: 'hidden',
  '@media (min-width: 750px)': {
    paddingLeft: theme.customSpacing[12],
    paddingRight: theme.customSpacing[12],
  },
  '@media (min-width: 1024px)': {
    paddingTop: theme.customSpacing[20],
    paddingBottom: theme.customSpacing[20],
    paddingLeft: theme.customSpacing[8],
    paddingRight: theme.customSpacing[8],
  },
}));

export const GridContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.customSpacing[6],
  position: 'relative',
  '@media (min-width: 1024px)': {
    gridTemplateColumns: '1fr 1fr',
    gap: theme.customSpacing[5],
  },
}));

export const LeftPanel = styled(Box, { shouldForwardProp })<{ isDark?: boolean }>(
  ({ theme, isDark }) => ({
    position: 'relative',
    borderRadius: theme.customBorderRadius['2xl'],
    padding: theme.customSpacing[6],
    overflow: 'hidden',
    ...(isDark
      ? {
          background: theme.colors.slate[900],
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.4)',
        }
      : {
          background: `linear-gradient(180deg, ${theme.colors.slate[800]} 0%, ${theme.colors.slate[900]} 100%)`,
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.3)',
        }),
    '@media (min-width: 768px)': {
      padding: theme.customSpacing[8],
    },
  }),
);

export const DotPattern = styled(Box)({
  position: 'absolute',
  top: 0,
  right: 0,
  width: 120,
  height: 120,
  opacity: 0.35,
  background:
    'radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
  pointerEvents: 'none',
});

export const FormTitle = styled(Typography)(({ theme }) => ({
  ...theme.display.h4.bold,
  fontSize: '24px',
  color: theme.colors.white,
  marginBottom: theme.customSpacing[2],
  position: 'relative',
  '@media (min-width: 768px)': {
    fontSize: '34px',
  },
})) as typeof Typography;

export const FormSubtitle = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.regular,
  color: theme.colors.white,
  opacity: 0.7,
  marginBottom: theme.customSpacing[6],
  position: 'relative',
})) as typeof Typography;

export const DarkFormOverridesWrapper = styled(Box)({
  position: 'relative',
  '--sc-common-white': 'rgba(255,255,255,0.07)',
  '--sc-text-secondary': 'rgba(255,255,255,0.65)',
  '--sc-text-primary': '#ffffff',
  '--sc-error-main': '#f87171',
  '--sc-error-dark': '#fca5a5',
  '--sc-error-light': '#ef4444',
  '& input::placeholder, & textarea::placeholder': {
    color: 'rgba(255,255,255,0.4) !important',
    WebkitTextFillColor: 'rgba(255,255,255,0.4)',
  },
} as Record<string, unknown>);

export const FormGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.customSpacing[5],
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr',
  },
}));

export const FullWidthCell = styled(Box)({
  '@media (min-width: 768px)': {
    gridColumn: '1 / -1',
  },
});

export const SubmitRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.customSpacing[5],
  '& > button, & > .MuiButtonBase-root': {
    width: '100%',
    '@media (min-width: 768px)': {
      width: 'auto',
    },
  },
}));

export const RightPanel = styled(Box, { shouldForwardProp })<{ isDark?: boolean }>(
  ({ theme, isDark }) => ({
    borderRadius: theme.customBorderRadius['2xl'],
    padding: theme.customSpacing[6],
    ...(isDark
      ? {
          background: `linear-gradient(180deg, ${theme.colors.slate[800]} 0%, ${theme.colors.slate[900]} 100%)`,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.3)',
        }
      : {
          background: `linear-gradient(180deg, ${theme.colors.slate[800]} 0%, ${theme.colors.slate[900]} 100%)`,
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.10), 0 1px 3px rgba(0,0,0,0.2)',
        }),
    '@media (min-width: 768px)': {
      padding: theme.customSpacing[8],
    },
  }),
);

export const LogoImage = styled('img')({
  height: 36,
  width: 'auto',
  maxWidth: '100%',
});

export const BrandText = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body1.semibold,
  color: theme.colors.white,
  fontSize: 22,
})) as typeof Typography;

export const RightPanelDescription = styled(Typography, { shouldForwardProp })<{
  isDark?: boolean;
}>(({ theme, isDark }) => ({
  ...theme.customTypography.body1.regular,
  color: isDark ? theme.colors.slate[400] : 'rgba(255,255,255,0.65)',
  marginTop: theme.customSpacing[2],
}));

export const ContactDetailsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[4],
  marginTop: theme.customSpacing[6],
}));

export const ContactRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[3],
}));

export const ContactIconWrap = styled(Box, { shouldForwardProp })<{ isDark?: boolean }>(
  ({ theme, isDark }) => ({
    color: isDark ? theme.colors.slate[400] : 'rgba(255,255,255,0.65)',
    marginTop: '2px',
    flexShrink: 0,
  }),
);

export const ContactLabel = styled(Typography, { shouldForwardProp })<{ isDark?: boolean }>(
  ({ theme, isDark }) => ({
    ...theme.customTypography.body2.semibold,
    color: isDark ? theme.colors.slate[100] : theme.colors.white,
  }),
);

export const ContactValue = styled(Typography, { shouldForwardProp })<{ isDark?: boolean }>(
  ({ theme, isDark }) => ({
    ...theme.customTypography.body1.regular,
    color: isDark ? theme.colors.slate[400] : 'rgba(255,255,255,0.65)',
  }),
);

export const PanelDivider = styled(Box)(({ theme }) => ({
  marginTop: theme.customSpacing[5],
  height: '1px',
  background:
    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%)',
}));

export const MapWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.customSpacing[6],
}));

export const DefaultMapBox = styled(Box)(({ theme }) => ({
  minHeight: 180,
  borderRadius: theme.customBorderRadius.lg,
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid rgba(255,255,255,0.10)',
  backgroundColor: theme.colors.slate[800],
  backgroundImage: [
    'linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)',
    `radial-gradient(circle at 50% 50%, ${theme.colors.blue[500]} 0 5px, transparent 6px)`,
  ].join(', '),
  backgroundSize: '32px 32px, 32px 32px, 100% 100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const DefaultMapLabel = styled(Typography)(({ theme }) => ({
  ...theme.customTypography.body2.semibold,
  color: theme.colors.slate[200],
  padding: `${theme.customSpacing[2]} ${theme.customSpacing[3]}`,
  borderRadius: theme.customBorderRadius.full,
  background: 'rgba(15,23,42,0.82)',
  border: '1px solid rgba(255,255,255,0.10)',
})) as typeof Typography;
