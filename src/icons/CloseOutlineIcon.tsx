'use client';

import React from 'react';
import { createIcon } from './createIcon';

// close--outline
export const CloseOutlineIcon = createIcon('0 0 32 32', (color) => (
  <path
    d="M16 2C23.8 2 30 8.2 30 16C30 23.8 23.8 30 16 30C8.2 30 2 23.8 2 16C2 8.2 8.2 2 16 2ZM16 4C9.4 4 4 9.4 4 16C4 22.6 9.4 28 16 28C22.6 28 28 22.6 28 16C28 9.4 22.6 4 16 4ZM23 10.5996L17.5996 16L23 21.4004L21.4004 23L16 17.5996L10.5996 23L9 21.4004L14.4004 16L9 10.5996L10.5996 9L16 14.4004L21.4004 9L23 10.5996Z"
    fill={color}
  />
));
