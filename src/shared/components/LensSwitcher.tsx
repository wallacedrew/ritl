import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

export type LensView = "human" | "agent" | "compare";

interface LensSwitcherProps {
  entry: CatalogEntry;
  currentView: LensView;
}

const VIEW_LABELS: Record<LensView, string> = {
  human: "Human",
  agent: "Agent",
  compare: "Compare",
};

const VIEW_ORDER: readonly LensView[] = ["human", "compare", "agent"];

function hrefFor(entry: CatalogEntry, view: LensView): string {
  if (view === "human") return entry.href();
  if (view === "agent") return entry.agentHref();
  return entry.compareHref();
}

export default function LensSwitcher({ entry, currentView }: LensSwitcherProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
      {VIEW_ORDER.map((view, index) => (
        <Stack key={view} direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
          {index > 0 && (
            <Typography variant="body2" color="text.secondary" component="span">
              ·
            </Typography>
          )}
          {view === currentView ? (
            <Typography variant="body2" component="span" color="text.secondary">
              {VIEW_LABELS[view]}
            </Typography>
          ) : (
            <Typography variant="body2" component="span">
              <NextLink href={hrefFor(entry, view)}>{VIEW_LABELS[view]}</NextLink>
            </Typography>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
