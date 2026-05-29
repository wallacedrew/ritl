import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ExpandableCatalogChip from "@/shared/components/ExpandableCatalogChip";

import type { RankedEntry } from "../lib/computeCatalogMap";

interface Props {
  entries: readonly RankedEntry[];
  emptyMessage: string;
}

export default function RankedEntriesList({ entries, emptyMessage }: Props) {
  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
        {emptyMessage}
      </Typography>
    );
  }
  return (
    <Stack spacing={0.75}>
      {entries.map((entry) => (
        <Stack
          key={entry.chip.href}
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexWrap: "wrap" }}
        >
          <ExpandableCatalogChip
            label={entry.chip.label}
            href={entry.chip.href}
            tone={entry.chip.tone}
          />
          <Typography variant="body2" color="text.secondary">
            {entry.outboundCount} outbound · {entry.inboundCount} inbound
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
