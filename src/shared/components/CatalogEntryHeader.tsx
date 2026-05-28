import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import LinkedChip from "@/shared/components/LinkedChip";
import { MONOSPACE_FONT } from "@/shared/theme/monospace";
import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { chipColorForTone } from "@/shared/lib/catalogChipColor";

const NAV_ARROW_STYLE = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  width: 32,
  height: 32,
  borderRadius: "50%",
  color: "#666",
  textDecoration: "none",
};

/**
 * Soft tone-tinted background + dark text for the catalog-number badge.
 * Hard-coded so the sx prop stays a plain object — required because this
 * component runs as a server component (sx callbacks serialize as
 * functions, which Next.js can't pass from server to client children).
 *
 * Colors match MUI's default success/error/warning/info palette: bg is
 * the `.main` hex at ~15% alpha, fg is the `.dark` hex.
 */
const TONE_BADGE_STYLES: Record<CatalogEntryTone, { bg: string; fg: string }> = {
  refactoring: { bg: "rgba(46, 125, 50, 0.15)", fg: "#1b5e20" },
  smell: { bg: "rgba(211, 47, 47, 0.15)", fg: "#c62828" },
  "kerievsky-pattern": { bg: "rgba(237, 108, 2, 0.15)", fg: "#e65100" },
  "gof-pattern": { bg: "rgba(2, 136, 209, 0.15)", fg: "#01579b" },
};

interface CatalogEntryHeaderProps {
  name: CatalogEntryName;
  number: number;
  relatedNames: readonly CatalogEntryName[];
  destinationPattern?: CatalogEntryName;
  incomingSources?: readonly CatalogEntryName[];
  inboundPatterns?: readonly CatalogEntryName[];
  neighbors?: CatalogNeighbors;
}

function LabeledChipRow({ label, chips }: { label: string; chips: readonly CatalogEntryName[] }) {
  if (chips.length === 0) return null;
  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.4 }}>
        {label}
      </Typography>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        {chips.map((chip) => (
          <LinkedChip
            key={chip.toCatalogHref()}
            label={chip.toString()}
            href={chip.toCatalogHref()}
            color={chipColorForTone(chip.tone())}
          />
        ))}
      </Stack>
    </Stack>
  );
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
}: CatalogEntryHeaderProps) {
  const prev = neighbors?.prev ?? null;
  const next = neighbors?.next ?? null;

  return (
    <Stack spacing={1.5}>
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
              px: 1.25,
              py: 0.5,
              borderRadius: 1,
              bgcolor: TONE_BADGE_STYLES[name.tone()].bg,
              color: TONE_BADGE_STYLES[name.tone()].fg,
              fontFamily: MONOSPACE_FONT,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 700,
              fontSize: "0.875rem",
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
      <LabeledChipRow label={nemesesLabel(name)} chips={relatedNames} />
      {destinationPattern && <LabeledChipRow label="Destination" chips={[destinationPattern]} />}
      {incomingSources && <LabeledChipRow label="Reached from" chips={incomingSources} />}
      {inboundPatterns && <LabeledChipRow label="Referenced by patterns" chips={inboundPatterns} />}
    </Stack>
  );
}
