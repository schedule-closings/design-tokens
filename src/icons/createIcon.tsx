'use client';

import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
}

export function createIcon(
  viewBox: string,
  render: (color: string) => React.ReactNode,
  defaultSize = 20,
): React.FC<IconProps> {
  return function Icon({ size = defaultSize, color = 'currentColor' }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {render(color)}
      </svg>
    );
  };
}
