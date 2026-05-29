"use client";

import { type MouseEvent, useId, useMemo, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import NextLink from "next/link";

import LinkedChip from "@/shared/components/LinkedChip";
import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";
import { computeCrossReferencesForHref } from "@/shared/lib/CatalogGraph";
import { badgePaletteKey, type BadgePaletteKey } from "@/shared/lib/catalogChipColor";
import { useCatalogGraph } from "@/shared/hooks/useCatalogGraph";
import { useOpenPopover } from "@/shared/hooks/useOpenPopover";

import { isEmptyCrossReferences } from "../lib/RelationshipGroup";
import CrossReferencePanel from "./CrossReferencePanel";

interface Props {
  label: string;
  href: string;
  tone: CatalogEntryTone;
}

export default function ExpandableCatalogChip({ label, href, tone }: Props) {
  const graph = useCatalogGraph();
  const instanceId = useId();
  const { isOpen, toggle: togglePanel, close: closePanel } = useOpenPopover(instanceId);
  const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);
  const popoverLabel = `${label} cross-references`;

  const crossReferences = useMemo(
    () => (graph ? computeCrossReferencesForHref(href, graph) : null),
    [graph, href],
  );

  function dismissOnInnerLinkClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("a")) closePanel();
  }

  if (!crossReferences || isEmptyCrossReferences(crossReferences)) {
    return <LinkedChip label={label} href={href} tone={tone} />;
  }

  const paletteKey = badgePaletteKey(tone);

  return (
    <>
      <Box ref={setAnchorElement} sx={splitChipContainerSx(paletteKey)}>
        <Box component={NextLink} href={href} sx={splitChipLabelSx(paletteKey)}>
          {label}
        </Box>
        <Box sx={splitChipDividerSx(paletteKey)} aria-hidden="true" />
        <Box
          component="button"
          type="button"
          onClick={togglePanel}
          aria-label={popoverLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          sx={splitChipChevronSx(paletteKey)}
        >
          <ExpandMoreIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>
      <Popover
        open={isOpen}
        anchorEl={anchorElement}
        onClose={closePanel}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            role: "dialog",
            "aria-label": popoverLabel,
            onClick: dismissOnInnerLinkClick,
          },
        }}
      >
        <CrossReferencePanel crossReferences={crossReferences} />
      </Popover>
    </>
  );
}

function splitChipContainerSx(paletteKey: BadgePaletteKey): SxProps<Theme> {
  return (theme) => ({
    display: "inline-flex",
    alignItems: "stretch",
    height: 24,
    borderRadius: 12,
    border: `1px solid ${alpha(theme.palette[paletteKey].main, 0.5)}`,
    backgroundColor: "transparent",
    overflow: "hidden",
  });
}

function splitChipLabelSx(paletteKey: BadgePaletteKey): SxProps<Theme> {
  return (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    paddingLeft: "10px",
    paddingRight: "8px",
    color: theme.palette[paletteKey].dark,
    fontSize: "0.8125rem",
    fontWeight: 500,
    textDecoration: "none",
    lineHeight: 1,
    transition: "background-color 120ms",
    "&:hover": {
      backgroundColor: alpha(theme.palette[paletteKey].main, 0.08),
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette[paletteKey].main}`,
      outlineOffset: -2,
    },
  });
}

function splitChipDividerSx(paletteKey: BadgePaletteKey): SxProps<Theme> {
  return (theme) => ({
    width: "1px",
    alignSelf: "center",
    height: "65%",
    backgroundColor: alpha(theme.palette[paletteKey].main, 0.4),
  });
}

function splitChipChevronSx(paletteKey: BadgePaletteKey): SxProps<Theme> {
  return (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "6px",
    paddingRight: "6px",
    background: "transparent",
    border: "none",
    color: theme.palette[paletteKey].dark,
    cursor: "pointer",
    transition: "background-color 120ms",
    "&:hover": {
      backgroundColor: alpha(theme.palette[paletteKey].main, 0.08),
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette[paletteKey].main}`,
      outlineOffset: -2,
    },
  });
}
