import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ExpandableCatalogChip from "@/reference/components/ExpandableCatalogChip";
import LinkedChip from "@/shared/components/LinkedChip";

import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

interface CategoryGroupProps {
  category: string;
  items: CatalogListItem[];
}

export default function CategoryGroup({ category, items }: CategoryGroupProps) {
  return (
    <Stack spacing={1.5}>
      <Typography component="h2" variant="h6">
        {category}
      </Typography>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, rowGap: 1.5 }}>
        {items.map((item) =>
          item.crossReferences ? (
            <ExpandableCatalogChip
              key={item.name}
              label={item.name}
              href={item.href}
              tone={item.tone}
              crossReferences={item.crossReferences}
            />
          ) : (
            <LinkedChip key={item.name} label={item.name} href={item.href} tone={item.tone} />
          ),
        )}
      </Stack>
    </Stack>
  );
}
