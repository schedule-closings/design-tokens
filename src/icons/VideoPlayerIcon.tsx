'use client';

import React from 'react';
import { createIcon } from './createIcon';

// video-player
export const VideoPlayerIcon = createIcon('0 0 32 32', (color) => (
  <path
    d="M28 6C29.103 6 30 6.8975 30 8V24C30 25.1025 29.103 26 28 26H4C2.897 26 2 25.1025 2 24V8C2 6.8975 2.897 6 4 6H28ZM4 8V24H28V8H4ZM21 16L13 21V11L21 16Z"
    fill={color}
  />
));
