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
    <Stack
      direction="row"
      spacing={3}
      sx={{ borderBottom: 1, borderColor: "divider", alignItems: "stretch" }}
    >
      {VIEW_ORDER.map((view) => {
        const isActive = view === currentView;
        const commonSx = {
          py: 1,
          fontWeight: isActive ? 600 : 500,
          color: isActive ? "primary.main" : "text.secondary",
          textDecoration: "none",
          borderBottom: 2,
          borderColor: isActive ? "primary.main" : "transparent",
          marginBottom: "-1px",
          transition: "color 150ms, border-color 150ms",
          "&:hover": {
            color: isActive ? "primary.main" : "text.primary",
          },
        } as const;

        return isActive ? (
          <Typography key={view} variant="body2" component="span" aria-current="page" sx={commonSx}>
            {VIEW_LABELS[view]}
          </Typography>
        ) : (
          <Typography
            key={view}
            variant="body2"
            component={NextLink}
            href={hrefFor(entry, view)}
            sx={commonSx}
          >
            {VIEW_LABELS[view]}
          </Typography>
        );
      })}
    </Stack>
  );
}
