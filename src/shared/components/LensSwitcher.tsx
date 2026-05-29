"use client";

import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import VerticalSplitOutlinedIcon from "@mui/icons-material/VerticalSplitOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NextLink from "next/link";
import type { ReactElement, ReactNode } from "react";

export type LensView = "human" | "agent" | "compare";

interface LensSwitcherProps {
  humanHref: string;
  compareHref: string;
  agentHref: string;
  currentView: LensView;
}

interface LensButtonProps {
  isActive: boolean;
  href: string;
  children: ReactNode;
}

const INACTIVE_BG = "#f3eee4";

const BUTTON_BASE_SX = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  px: 1.5,
  py: 0.625,
  fontSize: "0.875rem",
  fontWeight: 500,
  textDecoration: "none",
  lineHeight: 1.4,
  transition: "background-color 150ms",
  "& svg": {
    fontSize: "1.125rem",
  },
} as const;

function LensButton({ isActive, href, children }: LensButtonProps) {
  if (isActive) {
    return (
      <Box
        component="span"
        aria-current="page"
        sx={{
          ...BUTTON_BASE_SX,
          bgcolor: "background.paper",
          color: "text.primary",
          cursor: "default",
        }}
      >
        {children}
      </Box>
    );
  }
  return (
    <Box
      component={NextLink}
      href={href}
      sx={{
        ...BUTTON_BASE_SX,
        bgcolor: INACTIVE_BG,
        color: "text.primary",
        "&:hover": {
          bgcolor: "#eae4d8",
        },
      }}
    >
      {children}
    </Box>
  );
}

function GroupShell({ children }: { children: ReactElement | ReactElement[] }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "stretch",
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}

function InnerDivider() {
  return <Box aria-hidden="true" sx={{ width: "1px", bgcolor: "divider" }} />;
}

export default function LensSwitcher({
  humanHref,
  compareHref,
  agentHref,
  currentView,
}: LensSwitcherProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <GroupShell>
        <LensButton isActive={currentView === "human"} href={humanHref}>
          <PersonOutlineIcon />
          Human
        </LensButton>
        <InnerDivider />
        <LensButton isActive={currentView === "agent"} href={agentHref}>
          <SmartToyOutlinedIcon />
          Agent
        </LensButton>
      </GroupShell>
      <Box aria-hidden="true" sx={{ width: "1px", height: 20, bgcolor: "divider" }} />
      <GroupShell>
        <LensButton isActive={currentView === "compare"} href={compareHref}>
          <VerticalSplitOutlinedIcon />
          Compare
        </LensButton>
      </GroupShell>
    </Stack>
  );
}
