'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import { CloseIcon } from './icons';
import {
  ModalActionsRow,
  ModalCloseButton,
  ModalContentBox,
  ModalTitleText,
  SectionedActions,
  SectionedContent,
  SectionedHeader,
} from './Modal.styles';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: number | string;
  showCloseIcon?: boolean;
  layout?: 'default' | 'sectioned';
  sx?: SxProps<Theme>;
}

function sxArray(sx?: SxProps<Theme>): SxProps<Theme>[] {
  if (!sx) return [];
  return Array.isArray(sx) ? sx : [sx];
}

function CloseButton({ onClose }: { onClose: () => void }) {
  const theme = useTheme();

  return (
    <ModalCloseButton type="button" onClick={onClose} aria-label="Close">
      <CloseIcon size={28} color={theme.semantic.text.secondary} />
    </ModalCloseButton>
  );
}

function TitleRow({ title }: { title: string }) {
  return <ModalTitleText>{title}</ModalTitleText>;
}

function ActionsRow({ actions }: { actions: React.ReactNode }) {
  return <ModalActionsRow>{actions}</ModalActionsRow>;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 480,
  showCloseIcon = true,
  layout = 'default',
  sx,
}: ModalProps) {
  const theme = useTheme();

  const micaDarkOverrides = {
    '[data-color-mode="dark"] &': {
      border: `1px solid ${theme.semantic.mica.border}`,
      boxShadow: theme.customShadows.modalDark,
    },
  };

  const backdropSx = {
    bgcolor: theme.semantic.backdrop.default,
    backdropFilter: `blur(${theme.semantic.backdrop.blur})`,
    WebkitBackdropFilter: `blur(${theme.semantic.backdrop.blur})`,
  };

  const defaultPaperSx: SxProps<Theme> = {
    position: 'relative',
    borderRadius: theme.customBorderRadius['3xl'],
    p: { xs: theme.customSpacing[6], md: theme.customSpacing[8] },
    m: theme.customSpacing[4],
    '@media (min-width: 750px)': { m: theme.customSpacing[12] },
    maxWidth,
    width: '100%',
    bgcolor: theme.semantic.common.white,
    backgroundImage: theme.surfaceOverlay.high,
    boxShadow: theme.customShadows.modal,
    ...micaDarkOverrides,
  };

  const sectionedPaperSx: SxProps<Theme> = {
    position: 'relative',
    borderRadius: theme.customBorderRadius['3xl'],
    m: theme.customSpacing[4],
    '@media (min-width: 750px)': { m: theme.customSpacing[12] },
    maxWidth,
    width: '100%',
    maxHeight: '85vh',
    bgcolor: theme.semantic.common.white,
    backgroundImage: theme.surfaceOverlay.high,
    boxShadow: theme.customShadows.modal,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '@media (max-width: 749px)': {
      m: 0,
      borderRadius: 0,
      maxWidth: '100%',
      width: '100%',
      height: '100%',
      maxHeight: '100%',
    },
    ...micaDarkOverrides,
  };

  if (layout === 'default') {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { sx: backdropSx },
        }}
        PaperProps={{ sx: [defaultPaperSx, ...sxArray(sx)] as SxProps<Theme> }}
      >
        {showCloseIcon && <CloseButton onClose={onClose} />}
        <ModalContentBox>
          {title && <TitleRow title={title} />}
          {children}
          {actions && <ActionsRow actions={actions} />}
        </ModalContentBox>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ '@media (max-width: 749px)': { '& .MuiDialog-container': { alignItems: 'stretch' } } }}
      slotProps={{
        backdrop: { sx: backdropSx },
      }}
      PaperProps={{ sx: [sectionedPaperSx, ...sxArray(sx)] as SxProps<Theme> }}
    >
      <SectionedHeader>
        {showCloseIcon && <CloseButton onClose={onClose} />}
        {title && <TitleRow title={title} />}
      </SectionedHeader>

      <SectionedContent>{children}</SectionedContent>

      {actions && (
        <SectionedActions>
          <ActionsRow actions={actions} />
        </SectionedActions>
      )}
    </Dialog>
  );
}
