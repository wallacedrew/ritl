"use client";

import Box from "@mui/material/Box";
import NextLink from "next/link";
import type { ReactNode } from "react";

import { SURFACE_TINT, SURFACE_TINT_HOVER } from "@/shared/theme/surfaces";

interface LensButtonProps {
  isActive: boolean;
  href: string;
  children: ReactNode;
}

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

export default function LensButton({ isActive, href, children }: LensButtonProps) {
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
        bgcolor: SURFACE_TINT,
        color: "text.primary",
        "&:hover": {
          bgcolor: SURFACE_TINT_HOVER,
        },
      }}
    >
      {children}
    </Box>
  );
}
