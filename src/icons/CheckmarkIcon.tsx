'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const CheckmarkIcon = createIcon('0 0 32 32', (color) => (
  <path
    d="M13 24.0001L4 15.0001L5.414 13.5861L13 21.1711L26.586 7.58606L28 9.00006L13 24.0001Z"
    fill={color}
  />
));
