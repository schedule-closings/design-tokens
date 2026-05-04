'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const CalendarIcon = createIcon('0 0 32 32', (color) => (
  <path
    d="M26 4H22V2H20V4H12V2H10V4H6C4.9 4 4 4.9 4 6V26C4 27.1 4.9 28 6 28H26C27.1 28 28 27.1 28 26V6C28 4.9 27.1 4 26 4ZM26 26H6V12H26V26ZM26 10H6V6H10V8H12V6H20V8H22V6H26V10Z"
    fill={color}
  />
));
