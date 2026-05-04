'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const ChevronRightIcon = createIcon('0 0 32 32', (color) => (
  <path
    d="M12.8 22.4L19.2 16L12.8 9.59996"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));
