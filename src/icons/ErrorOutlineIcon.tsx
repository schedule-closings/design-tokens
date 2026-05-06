'use client';

import React from 'react';
import { createIcon } from './createIcon';

// error--outline
export const ErrorOutlineIcon = createIcon('0 0 32 32', (color) => (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M2 16C2 8.2 8.2 2 16 2C23.8 2 30 8.2 30 16C30 23.8 23.8 30 16 30C8.2 30 2 23.8 2 16ZM8.36227 25.2377C10.441 26.9611 13.1051 28 16 28C22.6 28 28 22.6 28 16C28 13.105 26.9611 10.441 25.2376 8.3622L8.36227 25.2377ZM6.76227 23.6377C5.0389 21.5589 4 18.8949 4 16C4 9.4 9.4 4 16 4C18.8949 4 21.5589 5.03887 23.6376 6.76222L6.76227 23.6377Z"
    fill={color}
  />
));
