"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { useAnalytics } from "@/shared/hooks/useAnalytics";

type CatalogView = "smells" | "refactorings" | "reference" | "plugin";

interface NavLink {
  view: CatalogView;
  label: string;
  href: string;
  hideOnMobile?: boolean;
}

const NAV_LINKS: readonly NavLink[] = [
  { view: "refactorings", label: "Refactorings", href: "/" },
  { view: "smells", label: "Smells", href: "/refactoring/smells" },
  { view: "reference", label: "Reference", href: "/reference" },
  { view: "plugin", label: "Plugin", href: "/plugin", hideOnMobile: true },
];

function deriveActiveView(pathname: string): CatalogView {
  if (pathname.startsWith("/refactoring/smells")) return "smells";
  if (pathname.startsWith("/reference")) return "reference";
  if (pathname.startsWith("/plugin")) return "plugin";
  // "/", "/refactoring", and "/refactoring/refactorings/*" all map to the refactorings tab today.
  return "refactorings";
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
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Stack direction="row" sx={{ width: "100%" }}>
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
                display: link.hideOnMobile ? { xs: "none", md: "block" } : "block",
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
