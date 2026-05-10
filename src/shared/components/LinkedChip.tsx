"use client";

import Chip, { type ChipOwnProps } from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material/styles";
import NextLink from "next/link";

interface LinkedChipProps {
  label: string;
  href: string;
  variant?: ChipOwnProps["variant"];
  size?: ChipOwnProps["size"];
  color?: ChipOwnProps["color"];
  sx?: SxProps<Theme>;
}

export default function LinkedChip({
  label,
  href,
  variant = "outlined",
  size = "small",
  color = "default",
  sx,
}: LinkedChipProps) {
  return (
    <Chip
      component={NextLink}
      href={href}
      label={label}
      variant={variant}
      size={size}
      color={color}
      clickable
      sx={sx}
    />
  );
}
