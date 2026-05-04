'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const ChevronLeftIcon = createIcon('0 0 16.8 29.6', (color) => (
  <path
    transform="translate(4.2, 7.4)"
    d="M7.4 14.8L1 7.4L7.4 1"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));
