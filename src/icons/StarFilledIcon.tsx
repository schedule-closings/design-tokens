'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const StarFilledIcon = createIcon('0 0 32 32', (color) => (
  <path
    d="M16 2L11.45 11.22L1.28003 12.69L8.64003 19.87L6.90003 30L16 25.22L25.1 30L23.36 19.87L30.72 12.7L20.55 11.22L16 2Z"
    fill={color}
  />
));
