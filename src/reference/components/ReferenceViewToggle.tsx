"use client";

import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import Box from "@mui/material/Box";
import { usePathname } from "next/navigation";

import LensButton from "@/shared/components/LensButton";
import PillButtonGroup from "@/shared/components/PillButtonGroup";

type ReferenceView = "list" | "map";

function deriveActiveView(pathname: string): ReferenceView {
  return pathname.startsWith("/reference/map") ? "map" : "list";
}

function InnerDivider() {
  return <Box aria-hidden="true" sx={{ width: "1px", bgcolor: "divider" }} />;
}

export default function ReferenceViewToggle() {
  const pathname = usePathname();
  const active = deriveActiveView(pathname);

  return (
    <Box component="nav" aria-label="reference view toggle">
      <PillButtonGroup>
        <LensButton isActive={active === "list"} href="/reference/list">
          <FormatListBulletedOutlinedIcon />
          List
        </LensButton>
        <InnerDivider />
        <LensButton isActive={active === "map"} href="/reference/map">
          <MapOutlinedIcon />
          Map
        </LensButton>
      </PillButtonGroup>
    </Box>
  );
}
