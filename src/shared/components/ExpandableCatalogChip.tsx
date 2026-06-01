"use client";

import { type MouseEvent, useId, useMemo, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import NextLink from "next/link";

import LinkedChip from "@/shared/components/LinkedChip";
import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";
import { computeCrossReferencesForHref } from "@/shared/lib/CatalogGraph";
import { badgePaletteKey } from "@/shared/theme/catalogChipColor";
import { useCatalogGraph } from "@/shared/hooks/useCatalogGraph";
import { useOpenPopover } from "@/shared/hooks/useOpenPopover";

import { isEmptyCrossReferences } from "../lib/RelationshipGroup";
import CrossReferencePanel from "./CrossReferencePanel";
import {
  splitChipChevronSx,
  splitChipContainerSx,
  splitChipDividerSx,
  splitChipLabelSx,
} from "./expandableCatalogChipStyles";

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
        <Box component={NextLink} href={href} title={label} sx={splitChipLabelSx(paletteKey)}>
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
