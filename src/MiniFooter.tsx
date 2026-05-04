'use client';

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import {
  FooterRoot,
  CopyrightText,
  LinksRow,
  LinkItem,
  DotSeparator,
  FooterLink,
} from './MiniFooter.styles';

export interface MiniFooterLink {
  label: string;
  href: string;
}

export interface MiniFooterProps {
  links?: readonly MiniFooterLink[];
  copyrightText?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const DEFAULT_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'SMS Terms', href: '/sms-terms' },
] as const satisfies readonly MiniFooterLink[];

export default function MiniFooter({
  links = DEFAULT_LINKS,
  copyrightText = (
    <>
      &copy; 2026 Schedule Closings. All rights reserved.
    </>
  ),
  sx,
}: MiniFooterProps) {
  return (
    <FooterRoot component="footer" sx={sx}>
      <CopyrightText>
        {copyrightText}
      </CopyrightText>

      <LinksRow>
        {links.map((link, i) => (
          <LinkItem key={link.href}>
            {i > 0 && (
              <DotSeparator component="span">
                &middot;
              </DotSeparator>
            )}
            <FooterLink component="a" href={link.href}>
              {link.label}
            </FooterLink>
          </LinkItem>
        ))}
      </LinksRow>
    </FooterRoot>
  );
}
