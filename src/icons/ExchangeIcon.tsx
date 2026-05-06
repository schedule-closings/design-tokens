'use client';

import React from 'react';
import type { IconProps } from './createIcon';

// Microsoft Exchange Server brand tile. Color prop is intentionally ignored.
export function ExchangeIcon({ size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect x="2" y="3" width="20" height="18" rx="2" fill="#0072C6" />
      <path d="M8 7h8v2.2h-5.6v2.4h5.2v2.2h-5.2V16H16v2H8V7z" fill="#fff" />
    </svg>
  );
}
