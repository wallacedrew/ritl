"use client";

import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

import { useNavHover } from "@/shared/hooks/useNavHover";
import type { CatalogView } from "@/shared/lib/CatalogView";

interface Props {
  testId: string;
  relatedViews: readonly CatalogView[];
  children: ReactNode;
}

export default function SubSiteHoverBullet({ testId, relatedViews, children }: Props) {
  const { hover, clear } = useNavHover();

  function handleEnter() {
    hover(relatedViews);
  }

  function handleLeave() {
    clear();
  }

  return (
    <Typography
      component="li"
      variant="body1"
      data-testid={testId}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      sx={{
        transition: "background-color 150ms",
        borderRadius: 1,
        px: 0.5,
        mx: -0.5,
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      {children}
    </Typography>
  );
}
