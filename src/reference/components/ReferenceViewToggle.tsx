"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

type ReferenceView = "list" | "map";

interface ToggleLink {
  view: ReferenceView;
  label: string;
  href: string;
}

const TOGGLE_LINKS: readonly ToggleLink[] = [
  { view: "list", label: "List", href: "/reference/list" },
  { view: "map", label: "Map", href: "/reference/map" },
];

function deriveActiveView(pathname: string): ReferenceView {
  return pathname.startsWith("/reference/map") ? "map" : "list";
}

export default function ReferenceViewToggle() {
  const pathname = usePathname();
  const active = deriveActiveView(pathname);

  return (
    <Box component="nav" aria-label="reference view toggle">
      <Stack
        direction="row"
        spacing={2}
        sx={{ borderBottom: 1, borderColor: "divider", alignItems: "stretch" }}
      >
        {TOGGLE_LINKS.map((link) => {
          const isActive = link.view === active;
          return (
            <Box
              key={link.view}
              component={NextLink}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              sx={{
                py: 1,
                color: isActive ? "text.primary" : "text.secondary",
                fontSize: "0.9375rem",
                fontWeight: isActive ? 600 : 500,
                textDecoration: "none",
                borderBottom: 2,
                borderColor: isActive ? "primary.main" : "transparent",
                marginBottom: "-1px",
                transition: "color 150ms, border-color 150ms",
                "&:hover": { color: "text.primary" },
              }}
            >
              {link.label}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
