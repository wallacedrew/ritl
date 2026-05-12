"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { useAnalytics } from "@/shared/hooks/useAnalytics";

type CatalogView = "smells" | "refactorings" | "reference" | "plugin";

function deriveActiveView(pathname: string): CatalogView {
  if (pathname.startsWith("/smells")) return "smells";
  if (pathname.startsWith("/reference")) return "reference";
  if (pathname.startsWith("/plugin")) return "plugin";
  // "/" and "/refactorings/*" both show the refactorings list.
  return "refactorings";
}

export default function CatalogToolbar() {
  const pathname = usePathname();
  const active = deriveActiveView(pathname);
  const analytics = useAnalytics();

  function handleNavClick(tab: CatalogView) {
    analytics.track({ event: "nav_clicked", properties: { tab } });
  }

  return (
    <Tabs
      value={active}
      variant="fullWidth"
      textColor="primary"
      indicatorColor="primary"
      aria-label="catalog view"
      sx={{
        "& .MuiTab-root.Mui-selected": { fontWeight: 700 },
      }}
    >
      <Tab
        label="Refactorings"
        component={NextLink}
        href="/"
        value="refactorings"
        onClick={() => handleNavClick("refactorings")}
      />
      <Tab
        label="Smells"
        component={NextLink}
        href="/smells"
        value="smells"
        onClick={() => handleNavClick("smells")}
      />
      <Tab
        label="Reference"
        component={NextLink}
        href="/reference"
        value="reference"
        onClick={() => handleNavClick("reference")}
      />
      <Tab
        label="Plugin"
        component={NextLink}
        href="/plugin"
        value="plugin"
        onClick={() => handleNavClick("plugin")}
        sx={{ display: { xs: "none", md: "inline-flex" } }}
      />
    </Tabs>
  );
}
