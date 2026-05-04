'use client';

import React from 'react';
import { createIcon } from './createIcon';

export const CheckDoubleIcon = createIcon('0 0 32 32', (color) => (
  <path
    d="M21.4023 9L6.40234 24L0.597656 18.1953L2.01172 16.7812L2.60938 17.3789L6.40234 21.1709L19.9883 7.58594L21.4023 9ZM31.4023 9L16.4023 24L12.6992 20.2969L14.1113 18.8809L16.4023 21.1709L29.9883 7.58594L31.4023 9Z"
    fill={color}
  />
));
