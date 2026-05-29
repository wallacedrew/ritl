import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import LabeledChipRow, { type LabeledChipRowChip } from "@/shared/components/LabeledChipRow";
import { MONOSPACE_FONT } from "@/shared/theme/monospace";
import { collectCrossReferences, type CatalogSnapshot } from "@/shared/lib/collectCrossReferences";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

function indexEntriesByHref(snapshot: CatalogSnapshot): ReadonlyMap<string, CatalogEntry> {
  const lookup = new Map<string, CatalogEntry>();
  for (const entry of [...snapshot.smells, ...snapshot.refactorings, ...snapshot.patterns]) {
    lookup.set(entry.name.toCatalogHref(), entry);
  }
  return lookup;
}

function toChipFactory(
  snapshot: CatalogSnapshot | undefined,
): (name: CatalogEntryName) => LabeledChipRowChip {
  if (!snapshot) {
    return (name) => ({
      label: name.toString(),
      href: name.toCatalogHref(),
      tone: name.tone(),
    });
  }
  const entriesByHref = indexEntriesByHref(snapshot);
  return (name) => {
    const entry = entriesByHref.get(name.toCatalogHref());
    return {
      label: name.toString(),
      href: name.toCatalogHref(),
      tone: name.tone(),
      crossReferences: entry ? collectCrossReferences(entry, snapshot) : undefined,
    };
  };
}

const NAV_ARROW_STYLE = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "1px solid #e0e0e0",
  color: "#666",
  textDecoration: "none",
};

interface CatalogEntryHeaderProps {
  name: CatalogEntryName;
  number: number;
  relatedNames: readonly CatalogEntryName[];
  destinationPattern?: CatalogEntryName;
  incomingSources?: readonly CatalogEntryName[];
  inboundPatterns?: readonly CatalogEntryName[];
  neighbors?: CatalogNeighbors;
  /**
   * When supplied, each chip in the labeled rows is enriched with the
   * connected entries that would render in its cross-reference popover.
   * Omit to render plain chips (no chevron).
   */
  snapshot?: CatalogSnapshot;
}

function nemesesLabel(name: CatalogEntryName): string {
  switch (name.tone()) {
    case "refactoring":
      return "Removes smells";
    case "smell":
      return "Apply refactorings";
    case "kerievsky-pattern":
    case "gof-pattern":
      return "Triggered by";
  }
}

export default function CatalogEntryHeader({
  name,
  number,
  relatedNames,
  destinationPattern,
  incomingSources,
  inboundPatterns,
  neighbors,
  snapshot,
}: CatalogEntryHeaderProps) {
  const prev = neighbors?.prev ?? null;
  const next = neighbors?.next ?? null;
  const toChip = toChipFactory(snapshot);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 700,
            flex: 1,
            lineHeight: 1.2,
            fontSize: { xs: "1.375rem", sm: "1.625rem", md: "2.125rem" },
          }}
        >
          {name.toString()}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", flexShrink: 0 }}>
          {prev ? (
            <NextLink
              href={prev.href}
              aria-label={`Previous: ${prev.name}`}
              style={NAV_ARROW_STYLE}
            >
              <ChevronLeftIcon fontSize="small" />
            </NextLink>
          ) : (
            <Box sx={{ width: 32, height: 32 }} aria-hidden="true" />
          )}
          <Box
            aria-hidden="true"
            sx={{
              flexShrink: 0,
              px: 1,
              fontFamily: MONOSPACE_FONT,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "text.secondary",
              lineHeight: 1.5,
            }}
          >
            {String(number).padStart(2, "0")}
          </Box>
          {next ? (
            <NextLink href={next.href} aria-label={`Next: ${next.name}`} style={NAV_ARROW_STYLE}>
              <ChevronRightIcon fontSize="small" />
            </NextLink>
          ) : (
            <Box sx={{ width: 32, height: 32 }} aria-hidden="true" />
          )}
        </Stack>
      </Stack>
      <LabeledChipRow label={nemesesLabel(name)} chips={relatedNames.map(toChip)} />
      {destinationPattern && (
        <LabeledChipRow label="Destination" chips={[toChip(destinationPattern)]} />
      )}
      {incomingSources && (
        <LabeledChipRow label="Reached from" chips={incomingSources.map(toChip)} />
      )}
      {inboundPatterns && (
        <LabeledChipRow label="Referenced by patterns" chips={inboundPatterns.map(toChip)} />
      )}
    </Stack>
  );
}
