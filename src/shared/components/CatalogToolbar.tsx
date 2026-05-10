"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import NextLink from "next/link";

export type CatalogView = "smells" | "refactorings" | "reference";

interface CatalogToolbarProps {
  active: CatalogView;
}

export default function CatalogToolbar({ active }: CatalogToolbarProps) {
  return (
    <Tabs
      value={active}
      variant="fullWidth"
      textColor="primary"
      indicatorColor="primary"
      aria-label="catalog view"
    >
      <Tab label="Smells" component={NextLink} href="/smells" value="smells" />
      <Tab label="Refactorings" component={NextLink} href="/refactorings" value="refactorings" />
      <Tab label="Reference" component={NextLink} href="/" value="reference" />
    </Tabs>
  );
}
