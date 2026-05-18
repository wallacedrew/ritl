import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

interface CatalogPrevNextStripProps {
  neighbors: CatalogNeighbors;
}

export default function CatalogPrevNextStrip({ neighbors }: CatalogPrevNextStripProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
      {neighbors.prev ? (
        <Typography variant="body2">
          <NextLink href={neighbors.prev.href} aria-label={`Previous: ${neighbors.prev.name}`}>
            ← {neighbors.prev.name}
          </NextLink>
        </Typography>
      ) : (
        <span />
      )}
      {neighbors.next ? (
        <Typography variant="body2">
          <NextLink href={neighbors.next.href} aria-label={`Next: ${neighbors.next.name}`}>
            {neighbors.next.name} →
          </NextLink>
        </Typography>
      ) : (
        <span />
      )}
    </Stack>
  );
}
