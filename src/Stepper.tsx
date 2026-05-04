'use client';

/**
 * Stepper --- simple, mobile-friendly progress indicator.
 *
 * Renders N pill-shaped segments side by side. Segments at or before
 * `activeStep` are filled with primary color; later segments are gray.
 * The active step's label is shown centered below the segments.
 *
 * Drop-in replacement for ArrowStepProgress when a slimmer, less
 * decorative step indicator is preferred (e.g. on mobile).
 *
 * Props:
 *   steps      --- (string | StepConfig)[]  required
 *   activeStep --- number  (0-based) optional. Defaults to 0.
 *   sx         --- SxProps                  Overrides on the outer container.
 */

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { StepperRoot, SegmentRow, Segment, ActiveLabel } from './Stepper.styles';

export interface StepperStepConfig {
  label: React.ReactNode;
}

export interface StepperProps {
  steps: (string | StepperStepConfig)[];
  activeStep?: number;
  sx?: SxProps<Theme>;
}

function getLabel(step: string | StepperStepConfig): React.ReactNode {
  return typeof step === 'string' ? step : step.label;
}

export default function Stepper({ steps = [], activeStep = 0, sx }: StepperProps) {
  if (steps.length === 0) return null;

  const activeIndex = Math.max(0, Math.min(activeStep, steps.length - 1));
  const activeLabel = getLabel(steps[activeIndex]);

  return (
    <StepperRoot sx={sx}>
      <SegmentRow role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={activeIndex + 1}>
        {steps.map((_, i) => (
          <Segment key={i} isFilled={i <= activeIndex} />
        ))}
      </SegmentRow>
      {activeLabel != null && <ActiveLabel>{activeLabel}</ActiveLabel>}
    </StepperRoot>
  );
}
