'use client';

import React from 'react';
import { createIcon } from './createIcon';

// add  (node 781:2521)
// Figma inset-1/4  viewBox 0 0 32 32, path offset +8 on all coords
export const AddIcon = createIcon('0 0 32 32', (color) => (
  <path d="M17 15V8H15V15H8V17H15V24H17V17H24V15H17Z" fill={color} />
));
