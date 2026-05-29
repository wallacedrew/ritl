import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ExpandableCatalogChip from "@/shared/components/ExpandableCatalogChip";

import type { CatalogMapBridge } from "../lib/computeCatalogMap";

interface Props {
  bridges: readonly CatalogMapBridge[];
  emptyMessage: string;
}

export default function CrossBookBridgesList({ bridges, emptyMessage }: Props) {
  if (bridges.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
        {emptyMessage}
      </Typography>
    );
  }
  return (
    <Stack spacing={0.75}>
      {bridges.map((bridge) => (
        <Stack
          key={`${bridge.source.href}->${bridge.destination.href}`}
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexWrap: "wrap" }}
        >
          <ExpandableCatalogChip
            label={bridge.source.label}
            href={bridge.source.href}
            tone={bridge.source.tone}
            crossReferences={bridge.source.crossReferences}
          />
          <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
            <ArrowForwardIcon fontSize="small" />
          </Box>
          <ExpandableCatalogChip
            label={bridge.destination.label}
            href={bridge.destination.href}
            tone={bridge.destination.tone}
            crossReferences={bridge.destination.crossReferences}
          />
        </Stack>
      ))}
    </Stack>
  );
}
