"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Chip from "@mui/material/Chip";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import NextLink from "next/link";
import type { ReactElement } from "react";

import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";
import { badgePaletteKey, type BadgePaletteKey } from "@/shared/lib/catalogChipColor";

interface LinkedChipProps {
  label: string;
  href: string;
  tone: CatalogEntryTone;
  sx?: SxProps<Theme>;
}

function iconFor(tone: CatalogEntryTone): ReactElement {
  switch (tone) {
    case "smell":
      return <WarningAmberIcon />;
    case "refactoring":
      return <ArrowForwardIcon />;
    case "kerievsky-pattern":
    case "gof-pattern":
      return <SubdirectoryArrowLeftIcon />;
  }
}

function tonedSx(paletteKey: BadgePaletteKey): SxProps<Theme> {
  return (theme) => ({
    backgroundColor: "transparent",
    color: theme.palette[paletteKey].dark,
    border: `1px solid ${alpha(theme.palette[paletteKey].main, 0.5)}`,
    fontWeight: 500,
    "& .MuiChip-icon": {
      color: theme.palette[paletteKey].main,
      marginLeft: "6px",
      marginRight: "-2px",
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette[paletteKey].main, 0.08),
    },
  });
}

export default function LinkedChip({ label, href, tone, sx }: LinkedChipProps) {
  const paletteKey = badgePaletteKey(tone);
  const tonedStyles = tonedSx(paletteKey);
  return (
    <Chip
      component={NextLink}
      href={href}
      label={label}
      icon={iconFor(tone)}
      size="small"
      clickable
      sx={[tonedStyles, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    />
  );
}
