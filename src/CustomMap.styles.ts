'use client';

import { styled, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ---------------------------------------------------------------------------
// Skeleton shimmer animation
// ---------------------------------------------------------------------------
export const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// ---------------------------------------------------------------------------
// MapSkeleton styled components
// ---------------------------------------------------------------------------

/** Outer skeleton wrapper - rounded, colored background with hidden overflow */
export const SkeletonRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: theme.customBorderRadius.lg,
  backgroundColor: '#e8ecf1',
  position: 'relative',
  overflow: 'hidden',
}));

/** Full-overlay that runs the shimmer animation via ::after pseudo-element */
export const SkeletonShimmer = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  zIndex: 2,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
    animation: `${shimmer} 2s ease-in-out infinite`,
  },
}));

/** Horizontal road line (absolute-positioned) */
export const SkeletonHRoad = styled(Box)(() => ({
  position: 'absolute',
  left: 0,
  right: 0,
  height: '1.5px',
  backgroundColor: '#d5dbe3',
}));

/** Vertical road line (absolute-positioned) */
export const SkeletonVRoad = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '1.5px',
  backgroundColor: '#d5dbe3',
}));

/** Diagonal road line */
export const SkeletonDiagonalRoad = styled(Box)(() => ({
  position: 'absolute',
  top: '10%',
  left: '5%',
  width: '50%',
  height: '1.5px',
  backgroundColor: '#d5dbe3',
  transform: 'rotate(25deg)',
  transformOrigin: 'left center',
}));

/** City block rectangle */
export const SkeletonBlock = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: '#dfe4eb',
  borderRadius: theme.customBorderRadius.sm,
}));

/** Zoom controls wrapper (top-left) */
export const SkeletonZoomControls = styled(Box)(() => ({
  position: 'absolute',
  top: 10,
  left: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  zIndex: 1,
}));

/** Top zoom button (+ shape) */
export const SkeletonZoomBtnTop = styled(Box)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: 'rgba(255,255,255,0.7)',
  borderRadius: `${theme.customBorderRadius.default} ${theme.customBorderRadius.default} 0 0`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

/** Bottom zoom button (- shape) */
export const SkeletonZoomBtnBottom = styled(Box)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: 'rgba(255,255,255,0.7)',
  borderRadius: `0 0 ${theme.customBorderRadius.default} ${theme.customBorderRadius.default}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

/** Horizontal bar inside zoom buttons */
export const SkeletonZoomBar = styled(Box)(() => ({
  width: 12,
  height: 1.5,
  backgroundColor: '#d5dbe3',
}));

/** Attribution bar placeholder (bottom-right) */
export const SkeletonAttribution = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  height: 18,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.6)',
  borderRadius: `${theme.customBorderRadius.sm} 0 0 0`,
}));

/** Inner bar inside the attribution placeholder */
export const SkeletonAttributionBar = styled(Box)(({ theme }) => ({
  width: 80,
  height: 6,
  backgroundColor: '#d5dbe3',
  borderRadius: theme.customBorderRadius.default,
}));
