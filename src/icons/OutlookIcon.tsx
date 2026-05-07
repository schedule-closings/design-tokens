'use client';

import React from 'react';
import type { IconProps } from './createIcon';

export function OutlookIcon({ size = 20 }: IconProps) {
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
      <path d="M14 4.5h7.2c.44 0 .8.36.8.8v13.4c0 .44-.36.8-.8.8H14V4.5z" fill="#fff" />
      <path d="M14 6.5h6v3h-6v-3zm0 4h6v3h-6v-3zm0 4h6v3h-6v-3z" fill="#0078D4" />
      <path d="M0 4.95L13.4 3v18l-13.4-1.95V4.95z" fill="#0078D4" />
      <path
        d="M6.7 8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5.4c-1.05 0-1.9-.85-1.9-1.9s.85-1.9 1.9-1.9 1.9.85 1.9 1.9-.85 1.9-1.9 1.9z"
        fill="#fff"
      />
    </svg>
  );
}
