'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const CaretDownIcon = createIcon('0 0 32 32', (color) => (
  <path d="M24 12L16 22L8 12H24Z" fill={color} />
));
