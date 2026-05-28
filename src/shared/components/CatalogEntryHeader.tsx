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
  destinationPattern?: CatalogEntryName;
  incomingSources?: readonly CatalogEntryName[];
  inboundPatterns?: readonly CatalogEntryName[];
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
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        {relatedNames.map((relatedName) => (
          <LinkedChip
            key={relatedName.toString()}
            label={relatedName.toString()}
            href={relatedName.toCatalogHref()}
          />
        ))}
      </Stack>
      {destinationPattern && (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Destination &rarr;
          </Typography>
          <LinkedChip
            label={destinationPattern.toString()}
            href={destinationPattern.toCatalogHref()}
          />
        </Stack>
      )}
      {incomingSources && incomingSources.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Reached from &rarr;
          </Typography>
          {incomingSources.map((source) => (
            <LinkedChip
              key={source.toString()}
              label={source.toString()}
              href={source.toCatalogHref()}
            />
          ))}
        </Stack>
      )}
      {inboundPatterns && inboundPatterns.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Referenced by patterns &rarr;
          </Typography>
          {inboundPatterns.map((pattern) => (
            <LinkedChip
              key={pattern.toCatalogHref()}
              label={pattern.toString()}
              href={pattern.toCatalogHref()}
            />
          ))}
        </Stack>
      )}
      <SnippetPreviewButton href={name.toSnippetHref()} label="Preview Markdown" />
    </Stack>
  );
}
