"use client";

import Chip from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material/styles";
import NextLink from "next/link";

import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";
import { tonedChipSx } from "@/shared/theme/catalogChipColor";

interface LinkedChipProps {
  label: string;
  href: string;
  tone: CatalogEntryTone;
  sx?: SxProps<Theme>;
}

export default function LinkedChip({ label, href, tone, sx }: LinkedChipProps) {
  const tonedStyles = tonedChipSx(tone);
  return (
    <Chip
      component={NextLink}
      href={href}
      label={label}
      size="small"
      clickable
      sx={[tonedStyles, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    />
  );
}
