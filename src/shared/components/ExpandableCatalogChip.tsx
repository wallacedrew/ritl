"use client";

import { type MouseEvent, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";

import LinkedChip from "@/shared/components/LinkedChip";
import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";

import { isEmptyCrossReferences, type CrossReferences } from "../lib/RelationshipGroup";
import CrossReferencePanel from "./CrossReferencePanel";

interface Props {
  label: string;
  href: string;
  tone: CatalogEntryTone;
  crossReferences?: CrossReferences;
}

export default function ExpandableCatalogChip({ label, href, tone, crossReferences }: Props) {
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const popoverLabel = `${label} cross-references`;

  function closePanel() {
    setIsOpen(false);
  }
  function toggle() {
    setIsOpen((open) => !open);
  }
  function dismissOnInnerLinkClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("a")) closePanel();
  }

  if (!crossReferences || isEmptyCrossReferences(crossReferences)) {
    return <LinkedChip label={label} href={href} tone={tone} />;
  }

  return (
    <Stack direction="row" spacing={0.25} sx={{ alignItems: "center" }}>
      <LinkedChip label={label} href={href} tone={tone} />
      <IconButton
        ref={setAnchorElement}
        size="small"
        aria-label={popoverLabel}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={toggle}
        sx={{ p: 0.25 }}
      >
        <ExpandMoreIcon fontSize="small" />
      </IconButton>
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
    </Stack>
  );
}
