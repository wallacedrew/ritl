"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { useAnalytics } from "@/shared/hooks/useAnalytics";

type CatalogView =
  | "smells"
  | "refactorings"
  | "reference"
  | "patterns"
  | "design-patterns"
  | "plugin";

interface NavLink {
  view: CatalogView;
  label: string;
  href: string;
  precededBySeparator?: boolean;
}

const NAV_LINKS: readonly NavLink[] = [
  { view: "refactorings", label: "Refactorings", href: "/refactoring/canon" },
  { view: "smells", label: "Smells", href: "/refactoring/smells" },
  { view: "patterns", label: "Patterns", href: "/refactoring-to-patterns" },
  { view: "design-patterns", label: "Design Patterns", href: "/design-patterns" },
  { view: "plugin", label: "Plugin", href: "/plugin", precededBySeparator: true },
  { view: "reference", label: "Reference", href: "/reference" },
];

function deriveActiveView(pathname: string): CatalogView {
  if (pathname.startsWith("/refactoring-to-patterns")) return "patterns";
  if (pathname.startsWith("/design-patterns")) return "design-patterns";
  if (pathname.startsWith("/refactoring/smells")) return "smells";
  if (pathname.startsWith("/refactoring/canon")) return "refactorings";
  if (pathname.startsWith("/plugin")) return "plugin";
  // "/reference" is the meta reference page; default for any unmatched URL.
  return "reference";
}

export default function CatalogToolbar() {
  const pathname = usePathname();
  const active = deriveActiveView(pathname);
  const analytics = useAnalytics();

  function handleNavClick(view: CatalogView) {
    analytics.track({ event: "nav_clicked", properties: { tab: view } });
  }

  return (
    <Box
      component="nav"
      aria-label="catalog navigation"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        // Horizontal scroll on narrow viewports; tabs keep their intrinsic
        // width and a hairline-thin scrollbar.
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.15)",
          borderRadius: 2,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        sx={{
          minWidth: "100%",
          width: { xs: "max-content", md: "100%" },
          alignItems: "stretch",
        }}
      >
        {NAV_LINKS.map((link) => {
          const isActive = link.view === active;
          return (
            <Fragment key={link.view}>
              {link.precededBySeparator && (
                <Box
                  aria-hidden="true"
                  sx={{
                    width: "1px",
                    bgcolor: "divider",
                    my: 1,
                    alignSelf: "stretch",
                  }}
                />
              )}
              <Box
                component={NextLink}
                href={link.href}
                onClick={() => handleNavClick(link.view)}
                aria-current={isActive ? "page" : undefined}
                sx={{
                  py: 1.5,
                  color: isActive ? "text.primary" : "text.secondary",
                  fontSize: "0.9375rem",
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  borderBottom: 2,
                  borderColor: isActive ? "primary.main" : "transparent",
                  marginBottom: "-1px",
                  transition: "color 150ms, border-color 150ms",
                  "&:hover": {
                    color: isActive ? "text.primary" : "text.primary",
                  },
                }}
              >
                {link.label}
              </Box>
            </Fragment>
          );
        })}
      </Stack>
    </Box>
  );
}
