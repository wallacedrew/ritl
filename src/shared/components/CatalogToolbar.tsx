"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

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
}

const NAV_LINKS: readonly NavLink[] = [
  { view: "refactorings", label: "Refactorings", href: "/refactoring/refactorings" },
  { view: "smells", label: "Smells", href: "/refactoring/smells" },
  { view: "patterns", label: "Patterns", href: "/refactoring-to-patterns" },
  { view: "design-patterns", label: "Design Patterns", href: "/design-patterns" },
  { view: "plugin", label: "Plugin", href: "/plugin" },
  { view: "reference", label: "Reference", href: "/refactoring" },
];

function deriveActiveView(pathname: string): CatalogView {
  if (pathname.startsWith("/refactoring-to-patterns")) return "patterns";
  if (pathname.startsWith("/design-patterns")) return "design-patterns";
  if (pathname.startsWith("/refactoring/smells")) return "smells";
  if (pathname.startsWith("/refactoring/refactorings")) return "refactorings";
  if (pathname.startsWith("/plugin")) return "plugin";
  // "/refactoring" (Fowler landing) maps to the reference tab.
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
        // Hide the scrollbar visually but keep scroll behavior (subtle on
        // touch screens; matches the "single-row tabs that scroll" pattern).
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
        sx={{
          minWidth: "100%",
          width: { xs: "max-content", md: "100%" },
        }}
      >
        {NAV_LINKS.map((link) => {
          const isActive = link.view === active;
          return (
            <Box
              key={link.view}
              component={NextLink}
              href={link.href}
              onClick={() => handleNavClick(link.view)}
              aria-current={isActive ? "page" : undefined}
              sx={(theme) => ({
                flex: { xs: "0 0 auto", md: 1 },
                textAlign: "center",
                px: { xs: 2, md: 1 },
                py: 1.5,
                color: isActive ? "primary.main" : "text.secondary",
                fontSize: theme.typography.button.fontSize,
                fontWeight: isActive ? 700 : 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                textDecoration: "none",
                whiteSpace: "nowrap",
                borderBottom: 2,
                borderColor: isActive ? "primary.main" : "transparent",
                marginBottom: "-1px",
                transition: theme.transitions.create(["color", "border-color"], {
                  duration: theme.transitions.duration.shortest,
                }),
                "&:hover": {
                  color: isActive ? "primary.main" : "text.primary",
                },
              })}
            >
              {link.label}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
