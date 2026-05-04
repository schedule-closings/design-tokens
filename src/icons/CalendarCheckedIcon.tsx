'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const CalendarCheckedIcon = createIcon('0 0 32 32', (color) => (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M26 4C27.1 4 28 4.9 28 6V12H26V6H22V8H20V6H12V8H10V6H6V26H12V28H6C4.9 28 4 27.1 4 26V6C4 4.9 4.9 4 6 4H10V2H12V4H20V2H22V4H26ZM22 30C17.6 30 14 26.4 14 22C14 17.6 17.6 14 22 14C26.4 14 30 17.6 30 22C30 26.4 26.4 30 22 30ZM22 16C18.7 16 16 18.7 16 22C16 25.3 18.7 28 22 28C25.3 28 28 25.3 28 22C28 18.7 25.3 16 22 16ZM21 23L19.41 21.4098L18 22.8198L21 25.82L26.32 20.5001L24.91 19.0901L21 23Z"
    fill={color}
  />
));
