"use client";

import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import VerticalSplitOutlinedIcon from "@mui/icons-material/VerticalSplitOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import LensButton from "./LensButton";
import PillButtonGroup from "./PillButtonGroup";

export type LensView = "human" | "agent" | "compare";

interface LensSwitcherProps {
  humanHref: string;
  compareHref: string;
  agentHref: string;
  currentView: LensView;
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
      <PillButtonGroup>
        <LensButton isActive={currentView === "human"} href={humanHref}>
          <PersonOutlineIcon />
          Human
        </LensButton>
        <InnerDivider />
        <LensButton isActive={currentView === "agent"} href={agentHref}>
          <SmartToyOutlinedIcon />
          Agent
        </LensButton>
      </PillButtonGroup>
      <Box aria-hidden="true" sx={{ width: "1px", height: 20, bgcolor: "divider" }} />
      <PillButtonGroup>
        <LensButton isActive={currentView === "compare"} href={compareHref}>
          <VerticalSplitOutlinedIcon />
          Compare
        </LensButton>
      </PillButtonGroup>
    </Stack>
  );
}
