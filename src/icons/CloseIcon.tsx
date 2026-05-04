'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const CloseIcon = createIcon('0 0 32 32', (color) => (
  <path
    d="M17.4141 16L24 9.4141L22.5859 8L16 14.5859L9.4143 8L8 9.4141L14.5859 16L8 22.5859L9.4143 24L16 17.4141L22.5859 24L24 22.5859L17.4141 16Z"
    fill={color}
  />
));
