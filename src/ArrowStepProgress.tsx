'use client';

/**
 * ArrowStepProgress --- horizontal arrow step-progress row.
 */

import React from 'react';
import { BoxProps } from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import ArrowStep, { ArrowShape, ArrowState, ArrowStatus } from './ArrowStep';
import { StepProgressRow } from './ArrowStepProgress.styles';

export interface ArrowStepProgressStepConfig {
  label: React.ReactNode;
  description?: string;
  state?: ArrowState;
  status?: ArrowStatus;
}

export interface ArrowStepProgressProps extends Omit<BoxProps, 'sx'> {
  steps: (string | ArrowStepProgressStepConfig)[];
  activeStep?: number;
  activeStatus?: ArrowStatus;
  height?: number;
  sx?: SxProps<Theme>;
}

interface NormalizedStep {
  label?: React.ReactNode;
  description?: string;
  state: ArrowState;
  status: ArrowStatus;
  shape: ArrowShape;
}

function deriveShape(index: number, total: number): ArrowShape {
  if (total === 1) return 'none';
  if (index === 0) return 'initial';
  if (index === total - 1) return 'end';
  return 'middle';
}

function deriveState(index: number, activeStep: number | undefined): ArrowState {
  if (activeStep == null) return 'inactive';
  if (index < activeStep) return 'completed';
  if (index === activeStep) return 'active';
  return 'inactive';
}

function normalizeSteps(
  steps: (string | ArrowStepProgressStepConfig)[],
  activeStep: number | undefined,
  activeStatus: ArrowStatus
): NormalizedStep[] {
  const total = steps.length;

  return steps.map((step, index) => {
    const base: ArrowStepProgressStepConfig = typeof step === 'string' ? { label: step } : { ...step };
    const state = base.state ?? deriveState(index, activeStep);
    const status = base.status ?? (state === 'active' ? activeStatus : 'default');
    const shape = deriveShape(index, total);

    return { label: base.label, description: base.description, state, status, shape };
  });
}

export default function ArrowStepProgress({
  steps = [],
  activeStep,
  activeStatus = 'default',
  height = 52,
  sx,
  ...props
}: ArrowStepProgressProps) {
  const normalized = normalizeSteps(steps, activeStep, activeStatus);

  return (
    <StepProgressRow sx={sx} {...props}>
      {normalized.map((step, index) => (
        <ArrowStep
          key={index}
          shape={step.shape}
          state={step.state}
          status={step.status}
          label={step.label}
          description={step.description}
          height={height}
          sx={{ flex: 1, width: 'auto', minWidth: 0 }}
        />
      ))}
    </StepProgressRow>
  );
}
