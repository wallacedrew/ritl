"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

type CatalogView = "smells" | "refactorings" | "reference";

function deriveActiveView(pathname: string): CatalogView {
  if (pathname.startsWith("/smells")) return "smells";
  if (pathname.startsWith("/refactorings")) return "refactorings";
  return "reference";
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
    >
      <Tab label="Refactorings" component={NextLink} href="/refactorings" value="refactorings" />
      <Tab label="Smells" component={NextLink} href="/smells" value="smells" />
      <Tab label="Reference" component={NextLink} href="/" value="reference" />
    </Tabs>
  );
}
