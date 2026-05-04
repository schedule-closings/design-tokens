'use client';

/**
 * StatusChip - SV Design System
 *
 * A purpose-built status indicator that wraps `Chip` with a built-in
 * status-to-color mapping. Pass a status string and get the right
 * duotone color automatically.
 *
 * Props:
 *   status - string - the status label (e.g. "In Progress", "Completed")
 *   style  - Chip style variant   default: 'duotone'
 *   size   - Chip size variant    default: 'mid'
 */

import Chip from './Chip';
import type { ChipColor } from './Chip';

export interface StatusChipProps {
  status: string;
  style?: 'filled' | 'outline' | 'ghost' | 'duotone';
  size?: 'base' | 'mid' | 'small' | 'overline';
}

// Status -> ChipColor mapping (case-insensitive).

const STATUS_COLOR_MAP: Record<string, ChipColor> = {
  // General / Law Firm
  'in progress':        'alert',
  'in-progress':        'alert',
  'pending':            'warning',
  'pending approval':   'warning',
  'new':                'new',
  'new request':        'new',
  'ready to close':     'success',
  'completed':          'success',
  'closed':             'success',
  'cancelled':          'error',
  'canceled':           'error',
  'rejected':           'error',
  'overdue':            'error',
  // Title Search
  'searching':          'alert',
  'under review':       'success',
  'delivered':          'success',
  // Title Insurance
  'new application':    'new',
  'underwriting':       'alert',
  'commitment issued':  'success',
  'policy issued':      'success',
  'declined':           'error',
  // Notary
  'scheduled':          'new',
  'docs returned':      'success',
  'no show':            'error',
};

function getStatusColor(status: string): ChipColor {
  return STATUS_COLOR_MAP[status.toLowerCase()] ?? 'default';
}

// Component

export default function StatusChip({
  status,
  style = 'duotone',
  size = 'mid',
}: StatusChipProps) {
  return (
    <Chip
      label={status}
      style={style}
      size={size}
      color={getStatusColor(status)}
      bold
    />
  );
}
