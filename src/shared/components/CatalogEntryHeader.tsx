import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CatalogNumber from "@/shared/components/CatalogNumber";
import LinkedChip from "@/shared/components/LinkedChip";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

interface CatalogEntryHeaderProps {
  name: CatalogEntryName;
  number: number;
  relatedNames: readonly CatalogEntryName[];
}

export default function CatalogEntryHeader({
  name,
  number,
  relatedNames,
}: CatalogEntryHeaderProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "baseline" }}>
        <CatalogNumber value={number} size="large" />
        <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
          {name.toString()}
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        {relatedNames.map((relatedName) => (
          <LinkedChip
            key={relatedName.toString()}
            label={relatedName.toString()}
            href={relatedName.toCatalogHref()}
          />
        ))}
      </Stack>
      <SnippetPreviewButton href={name.toSnippetHref()} label="Preview SKILL.md" />
    </Stack>
  );
}
