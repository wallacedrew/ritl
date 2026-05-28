import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CatalogNumber from "@/shared/components/CatalogNumber";
import LinkedChip from "@/shared/components/LinkedChip";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { chipColorForTone } from "@/shared/lib/catalogChipColor";

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
      <Stack direction="row" spacing={2} sx={{ alignItems: "baseline" }}>
        <CatalogNumber value={number} size="large" />
        <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
          {name.toString()}
        </Typography>
      </Stack>
      <LabeledChipRow label={nemesesLabel(name)} chips={relatedNames} />
      {destinationPattern && <LabeledChipRow label="Destination" chips={[destinationPattern]} />}
      {incomingSources && <LabeledChipRow label="Reached from" chips={incomingSources} />}
      {inboundPatterns && <LabeledChipRow label="Referenced by patterns" chips={inboundPatterns} />}
      <SnippetPreviewButton href={name.toSnippetHref()} label="Preview Markdown" />
    </Stack>
  );
}
