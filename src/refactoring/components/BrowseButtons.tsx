"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import NextLink from "next/link";

interface BrowseButtonsProps {
  refactoringsHref: string;
  smellsHref: string;
  kerievskyHref?: string;
  gofHref?: string;
}

export default function BrowseButtons({
  refactoringsHref,
  smellsHref,
  kerievskyHref,
  gofHref,
}: BrowseButtonsProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1 }}>
      <Button component={NextLink} href={refactoringsHref} variant="outlined">
        Browse all refactorings
      </Button>
      <Button component={NextLink} href={smellsHref} variant="outlined">
        Browse all smells
      </Button>
      {kerievskyHref && (
        <Button component={NextLink} href={kerievskyHref} variant="outlined">
          Browse Kerievsky patterns
        </Button>
      )}
      {gofHref && (
        <Button component={NextLink} href={gofHref} variant="outlined">
          Browse GoF design patterns
        </Button>
      )}
    </Stack>
  );
}
