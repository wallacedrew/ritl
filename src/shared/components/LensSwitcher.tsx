"use client";

import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import VerticalSplitOutlinedIcon from "@mui/icons-material/VerticalSplitOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { ReactElement } from "react";

import LensButton from "./LensButton";

export type LensView = "human" | "agent" | "compare";

interface LensSwitcherProps {
  humanHref: string;
  compareHref: string;
  agentHref: string;
  currentView: LensView;
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
