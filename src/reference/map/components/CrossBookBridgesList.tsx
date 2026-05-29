import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LinkedChip from "@/shared/components/LinkedChip";

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
          <LinkedChip
            label={bridge.source.label}
            href={bridge.source.href}
            tone={bridge.source.tone}
          />
          <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
            <ArrowForwardIcon fontSize="small" />
          </Box>
          <LinkedChip
            label={bridge.destination.label}
            href={bridge.destination.href}
            tone={bridge.destination.tone}
          />
        </Stack>
      ))}
    </Stack>
  );
}
