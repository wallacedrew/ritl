"use client";

import Box from "@mui/material/Box";
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
    <Box
      sx={{
        display: "inline-flex",
        alignSelf: "flex-start",
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
        padding: 0.5,
        gap: 0.25,
      }}
    >
      {VIEW_ORDER.map((view) => {
        const isActive = view === currentView;
        const baseSx = {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2.25,
          py: 0.75,
          borderRadius: 1,
          fontSize: "0.875rem",
          fontWeight: 600,
          textDecoration: "none",
          transition: "background-color 150ms, color 150ms",
        } as const;

        if (isActive) {
          return (
            <Box
              key={view}
              component="span"
              aria-current="page"
              sx={{
                ...baseSx,
                bgcolor: "text.primary",
                color: "background.paper",
                cursor: "default",
              }}
            >
              {VIEW_LABELS[view]}
            </Box>
          );
        }

        return (
          <Box
            key={view}
            component={NextLink}
            href={hrefFor[view]}
            sx={{
              ...baseSx,
              bgcolor: "transparent",
              color: "text.primary",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            {VIEW_LABELS[view]}
          </Box>
        );
      })}
    </Box>
  );
}
