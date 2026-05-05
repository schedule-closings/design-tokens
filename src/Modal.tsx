"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import type {
  DialogActionsProps,
  DialogContentProps,
  DialogProps,
} from "@mui/material";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import { CloseIcon } from "./icons";
import {
  getModalActionsJustifyContent,
  ModalActionsRow,
  ModalCloseButton,
  ModalContentBox,
  ModalTitleText,
  SectionedActions,
  SectionedContent,
  SectionedHeader,
} from "./Modal.styles";

export interface ModalProps extends Omit<
  DialogProps,
  "children" | "maxWidth" | "onClose" | "open" | "title"
> {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: DialogProps["maxWidth"] | number | string;
  showCloseIcon?: boolean;
  layout?: "default" | "sectioned";
  sx?: SxProps<Theme>;
  closeOnBackdropClick?: boolean;
  contentProps?: DialogContentProps;
  contentSx?: SxProps<Theme>;
  actionsProps?: DialogActionsProps;
  actionsSx?: SxProps<Theme>;
  actionsPosition?: "left" | "right" | "center";
  minHeight?: string | number;
  dialogSx?: SxProps<Theme>;
  disableEscapeKeyDown?: boolean;
  fullWidth?: boolean;
  scroll?: DialogProps["scroll"];
}

function sxArray(sx?: SxProps<Theme>): SxProps<Theme>[] {
  if (!sx) return [];
  return Array.isArray(sx) ? sx : [sx];
}

function composeSx(
  ...sxValues: (SxProps<Theme> | undefined)[]
): SxProps<Theme> {
  return sxValues.flatMap((sxValue) => sxArray(sxValue)) as SxProps<Theme>;
}

function isDialogMaxWidth(
  maxWidth: ModalProps["maxWidth"],
): maxWidth is DialogProps["maxWidth"] {
  return (
    maxWidth === false ||
    maxWidth === "xs" ||
    maxWidth === "sm" ||
    maxWidth === "md" ||
    maxWidth === "lg" ||
    maxWidth === "xl"
  );
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

function ActionsRow({
  actions,
  actionsPosition,
  sx,
}: {
  actions: React.ReactNode;
  actionsPosition: "left" | "right" | "center";
  sx?: SxProps<Theme>;
}) {
  return (
    <ModalActionsRow
      sx={
        [
          {
            justifyContent: getModalActionsJustifyContent(actionsPosition),
          },
          ...sxArray(sx),
        ] as SxProps<Theme>
      }
    >
      {actions}
    </ModalActionsRow>
  );
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 480,
  showCloseIcon = true,
  layout = "default",
  sx,
  closeOnBackdropClick = false,
  contentProps,
  contentSx,
  actionsProps,
  actionsSx,
  actionsPosition = "right",
  minHeight,
  dialogSx,
  disableEscapeKeyDown,
  scroll,
  fullWidth,
  ...dialogProps
}: ModalProps) {
  const theme = useTheme();
  const dialogMaxWidth = isDialogMaxWidth(maxWidth) ? maxWidth : false;
  const paperMaxWidth = isDialogMaxWidth(maxWidth) ? undefined : maxWidth;

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
    position: "relative",
    borderRadius: theme.customBorderRadius["3xl"],
    p: { xs: theme.customSpacing[6], md: theme.customSpacing[8] },
    m: theme.customSpacing[4],
    "@media (min-width: 750px)": { m: theme.customSpacing[12] },
    maxWidth: paperMaxWidth,
    minHeight,
    width: "100%",
    bgcolor: theme.semantic.common.white,
    backgroundImage: theme.surfaceOverlay.high,
    boxShadow: theme.customShadows.modal,
    ...micaDarkOverrides,
  };

  const sectionedPaperSx: SxProps<Theme> = {
    position: "relative",
    borderRadius: theme.customBorderRadius["3xl"],
    m: theme.customSpacing[4],
    "@media (min-width: 750px)": { m: theme.customSpacing[12] },
    maxWidth: paperMaxWidth,
    minHeight,
    width: "100%",
    maxHeight: "85vh",
    bgcolor: theme.semantic.common.white,
    backgroundImage: theme.surfaceOverlay.high,
    boxShadow: theme.customShadows.modal,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    "@media (max-width: 749px)": {
      m: 0,
      borderRadius: 0,
      maxWidth: "100%",
      width: "100%",
      height: "100%",
      maxHeight: "100%",
    },
    ...micaDarkOverrides,
  };

  const handleClose: DialogProps["onClose"] = (_, reason) => {
    if (!closeOnBackdropClick && reason === "backdropClick") return;
    if (disableEscapeKeyDown && reason === "escapeKeyDown") return;
    onClose();
  };

  if (layout === "default") {
    return (
      <Dialog
        {...dialogProps}
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown={disableEscapeKeyDown}
        scroll={scroll}
        fullWidth={fullWidth}
        maxWidth={dialogMaxWidth}
        sx={dialogSx}
        slotProps={{
          backdrop: { sx: backdropSx },
        }}
        PaperProps={{ sx: [defaultPaperSx, ...sxArray(sx)] as SxProps<Theme> }}
      >
        {showCloseIcon && <CloseButton onClose={onClose} />}
        <ModalContentBox
          {...contentProps}
          sx={composeSx(contentSx, contentProps?.sx)}
        >
          {title && <TitleRow title={title} />}
          {children}
          {actions && (
            <ActionsRow
              actions={actions}
              actionsPosition={actionsPosition}
              sx={composeSx(actionsSx, actionsProps?.sx)}
            />
          )}
        </ModalContentBox>
      </Dialog>
    );
  }

  return (
    <Dialog
      {...dialogProps}
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      scroll={scroll}
      fullWidth={fullWidth}
      maxWidth={dialogMaxWidth}
      sx={composeSx(
        {
          "@media (max-width: 749px)": {
            "& .MuiDialog-container": { alignItems: "stretch" },
          },
        },
        dialogSx,
      )}
      slotProps={{
        backdrop: { sx: backdropSx },
      }}
      PaperProps={{ sx: [sectionedPaperSx, ...sxArray(sx)] as SxProps<Theme> }}
    >
      <SectionedHeader>
        {showCloseIcon && <CloseButton onClose={onClose} />}
        {title && <TitleRow title={title} />}
      </SectionedHeader>

      <SectionedContent
        {...contentProps}
        sx={composeSx(contentSx, contentProps?.sx)}
      >
        {children}
      </SectionedContent>

      {actions && (
        <SectionedActions
          {...actionsProps}
          sx={composeSx(actionsSx, actionsProps?.sx)}
        >
          <ActionsRow actions={actions} actionsPosition={actionsPosition} />
        </SectionedActions>
      )}
    </Dialog>
  );
}
