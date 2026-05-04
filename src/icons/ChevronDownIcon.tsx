'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const ChevronDownIcon = createIcon('0 0 29.6 16.8', (color) => (
  <path
    transform="translate(7.4, 4.2)"
    d="M1 1L7.4 7.4L13.8 1"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));
