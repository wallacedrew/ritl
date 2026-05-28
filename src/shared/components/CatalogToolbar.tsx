"use client";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

function navLinkByView(view: CatalogView): NavLink | undefined {
  return NAV_LINKS.find((link) => link.view === view);
}

export default function CatalogToolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const active = deriveActiveView(pathname);
  const analytics = useAnalytics();

  function handleNavClick(view: CatalogView) {
    analytics.track({ event: "nav_clicked", properties: { tab: view } });
  }

  function handleSelectChange(event: SelectChangeEvent<CatalogView>) {
    const view = event.target.value as CatalogView;
    const target = navLinkByView(view);
    if (target) {
      handleNavClick(view);
      router.push(target.href);
    }
  }

  return (
    <Box
      component="nav"
      aria-label="catalog navigation"
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      {/* Desktop: horizontal tab strip */}
      <Stack direction="row" sx={{ width: "100%", display: { xs: "none", md: "flex" } }}>
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
                flex: 1,
                textAlign: "center",
                py: 1.5,
                color: isActive ? "primary.main" : "text.secondary",
                fontSize: theme.typography.button.fontSize,
                fontWeight: isActive ? 700 : 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                textDecoration: "none",
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

      {/* Mobile: dropdown navigating on change */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Select
          fullWidth
          size="small"
          value={active}
          onChange={handleSelectChange}
          inputProps={{ "aria-label": "catalog section" }}
        >
          {NAV_LINKS.map((link) => (
            <MenuItem key={link.view} value={link.view}>
              {link.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
}
