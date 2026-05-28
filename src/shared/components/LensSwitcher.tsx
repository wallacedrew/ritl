"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

export type LensView = "human" | "agent" | "compare";

interface LensSwitcherProps {
  humanHref: string;
  compareHref: string;
  agentHref: string;
  currentView: LensView;
}

const VIEW_LABELS: Record<LensView, string> = {
  human: "Human",
  agent: "Agent",
  compare: "Compare",
};

const VIEW_ORDER: readonly LensView[] = ["human", "compare", "agent"];

export default function LensSwitcher({
  humanHref,
  compareHref,
  agentHref,
  currentView,
}: LensSwitcherProps) {
  const hrefFor: Record<LensView, string> = {
    human: humanHref,
    compare: compareHref,
    agent: agentHref,
  };

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
            href={hrefFor[view]}
            sx={commonSx}
          >
            {VIEW_LABELS[view]}
          </Typography>
        );
      })}
    </Stack>
  );
}
