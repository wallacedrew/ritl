import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LinkedChip from "@/shared/components/LinkedChip";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

interface Props {
  label: string;
  chips: readonly CatalogEntryName[];
}

export default function LabeledChipRow({ label, chips }: Props) {
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
            tone={chip.tone()}
          />
        ))}
      </Stack>
    </Stack>
  );
}
