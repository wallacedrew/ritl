"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

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
      <Tab label="Refactorings" component={NextLink} href="/" value="refactorings" />
      <Tab label="Smells" component={NextLink} href="/smells" value="smells" />
      <Tab label="Reference" component={NextLink} href="/reference" value="reference" />
      <Tab
        label="Plugin"
        component={NextLink}
        href="/plugin"
        value="plugin"
        sx={{ display: { xs: "none", md: "inline-flex" } }}
      />
    </Tabs>
  );
}
