import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";
import { dotBgForTone } from "@/shared/lib/catalogChipColor";

interface LegendItem {
  tone: CatalogEntryTone;
  label: string;
}

const LEGEND: readonly LegendItem[] = [
  { tone: "smell", label: "Smell" },
  { tone: "refactoring", label: "Refactoring" },
  { tone: "kerievsky-pattern", label: "Kerievsky pattern" },
  { tone: "gof-pattern", label: "GoF pattern" },
];

export default function CatalogToneLegend() {
  return (
    <Stack
      direction="row"
      sx={{ alignItems: "center", flexWrap: "wrap", columnGap: 2, rowGap: 0.5 }}
    >
      {LEGEND.map((entry) => (
        <Stack key={entry.tone} direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: dotBgForTone(entry.tone),
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {entry.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
