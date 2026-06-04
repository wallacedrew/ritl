"use client";

import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import { type KeyboardEvent, type ReactNode, useId, useState } from "react";

import GlossaryDefinition from "@/shared/components/GlossaryDefinition";
import { useOpenPopover } from "@/shared/hooks/useOpenPopover";
import { GLOSSARY, type GlossaryTermKey, isKnownTerm } from "@/shared/lib/glossary";

interface Props {
  term: GlossaryTermKey;
  children: ReactNode;
}

const triggerSx = {
  borderBottom: "1px dotted",
  borderColor: "primary.main",
  color: "primary.main",
  cursor: "pointer",
  background: "transparent",
  border: "none",
  padding: 0,
  font: "inherit",
  textDecoration: "none",
  "&:focus-visible": {
    outline: "2px solid",
    outlineColor: "primary.main",
    outlineOffset: "2px",
    borderRadius: "2px",
  },
} as const;

export default function Term({ term, children }: Props) {
  const reactId = useId();
  const stackId = `term:${term}:${reactId}`;
  const { isOpen, toggle, close } = useOpenPopover(stackId);
  const [anchorElement, setAnchorElement] = useState<HTMLSpanElement | null>(null);

  if (!isKnownTerm(term)) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`Term: unknown glossary key "${term}" — rendering children unchanged`);
    }
    return <>{children}</>;
  }

  const entry = GLOSSARY[term];
  const popoverLabel = `Definition of ${term}`;

  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  }

  return (
    <>
      <Box
        component="span"
        ref={setAnchorElement}
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={popoverLabel}
        sx={triggerSx}
      >
        {children}
      </Box>
      <Popover
        open={isOpen}
        anchorEl={anchorElement}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            role: "dialog",
            "aria-label": popoverLabel,
          },
        }}
      >
        <GlossaryDefinition term={term} entry={entry} />
      </Popover>
    </>
  );
}
