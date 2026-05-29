import Stack from "@mui/material/Stack";

import LinkedChip from "@/shared/components/LinkedChip";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

interface FlatChipStripProps {
  items: readonly CatalogListItem[];
}

export default function FlatChipStrip({ items }: FlatChipStripProps) {
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
      {items.map((item) => (
        <LinkedChip key={item.name} label={item.name} href={item.href} tone={item.tone} />
      ))}
    </Stack>
  );
}
