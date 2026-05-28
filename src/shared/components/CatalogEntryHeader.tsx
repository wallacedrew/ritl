import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import LinkedChip from "@/shared/components/LinkedChip";
import { MONOSPACE_FONT } from "@/shared/theme/monospace";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { badgePaletteKey, chipColorForTone } from "@/shared/lib/catalogChipColor";

interface CatalogEntryHeaderProps {
  name: CatalogEntryName;
  number: number;
  relatedNames: readonly CatalogEntryName[];
  destinationPattern?: CatalogEntryName;
  incomingSources?: readonly CatalogEntryName[];
  inboundPatterns?: readonly CatalogEntryName[];
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
}: CatalogEntryHeaderProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, flex: 1, lineHeight: 1.2 }}>
          {name.toString()}
        </Typography>
        <Box
          aria-hidden="true"
          sx={(theme) => {
            const paletteKey = badgePaletteKey(name.tone());
            return {
              flexShrink: 0,
              px: 1.25,
              py: 0.5,
              borderRadius: 1,
              bgcolor: alpha(theme.palette[paletteKey].main, 0.15),
              color: theme.palette[paletteKey].dark,
              fontFamily: MONOSPACE_FONT,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 700,
              fontSize: "0.875rem",
              lineHeight: 1.5,
            };
          }}
        >
          {String(number).padStart(2, "0")}
        </Box>
      </Stack>
      <LabeledChipRow label={nemesesLabel(name)} chips={relatedNames} />
      {destinationPattern && <LabeledChipRow label="Destination" chips={[destinationPattern]} />}
      {incomingSources && <LabeledChipRow label="Reached from" chips={incomingSources} />}
      {inboundPatterns && <LabeledChipRow label="Referenced by patterns" chips={inboundPatterns} />}
    </Stack>
  );
}
