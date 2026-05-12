import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CatalogNumber from "@/shared/components/CatalogNumber";
import LinkedChip from "@/shared/components/LinkedChip";
import SnippetPreviewButton from "@/shared/components/SnippetPreviewButton";
import type { CatalogKind } from "@/shared/lib/Slug";
import { Slug } from "@/shared/lib/Slug";

interface CatalogEntryHeaderProps {
  name: string;
  number: number;
  relatedNames: readonly string[];
  relatedKind: CatalogKind;
  snippetKind: CatalogKind;
}

export default function CatalogEntryHeader({
  name,
  number,
  relatedNames,
  relatedKind,
  snippetKind,
}: CatalogEntryHeaderProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "baseline" }}>
        <CatalogNumber value={number} size="large" />
        <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
          {name}
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        {relatedNames.map((relatedName) => (
          <LinkedChip
            key={relatedName}
            label={relatedName}
            href={Slug.from(relatedName).toCatalogHref(relatedKind)}
          />
        ))}
      </Stack>
      <SnippetPreviewButton
        href={Slug.from(name).toSnippetHref(snippetKind)}
        label="Preview SKILL.md"
      />
    </Stack>
  );
}
