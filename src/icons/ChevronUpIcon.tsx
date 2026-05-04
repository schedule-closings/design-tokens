'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const ChevronUpIcon = createIcon('0 0 32 32', (color) => (
  <path
    d="M9.6001 19.2L16.0001 12.8L22.4001 19.2"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));
