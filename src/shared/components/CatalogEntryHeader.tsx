import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import LabeledChipRow from "@/shared/components/LabeledChipRow";
import type { CatalogEntryHeaderViewModel } from "@/shared/lib/CatalogDetailViewModel";
import { MONOSPACE_FONT } from "@/shared/theme/monospace";

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
  header: CatalogEntryHeaderViewModel;
}

export default function CatalogEntryHeader({ header }: CatalogEntryHeaderProps) {
  const prev = header.neighbors?.prev ?? null;
  const next = header.neighbors?.next ?? null;

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
          {header.title}
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
            {String(header.number).padStart(2, "0")}
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
      <LabeledChipRow label={header.nemesesLabel} chips={header.relatedChips} />
      {header.destinationChip && (
        <LabeledChipRow label="Destination" chips={[header.destinationChip]} />
      )}
      {header.incomingSourceChips && (
        <LabeledChipRow label="Reached from" chips={header.incomingSourceChips} />
      )}
      {header.inboundPatternChips && (
        <LabeledChipRow label="Referenced by patterns" chips={header.inboundPatternChips} />
      )}
    </Stack>
  );
}
