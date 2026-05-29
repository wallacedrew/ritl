"use client";

import { useContext } from "react";

import type { CatalogGraph } from "@/shared/lib/CatalogGraph";
import { CatalogGraphContext } from "@/shared/theme/CatalogGraphProvider";

export function useCatalogGraph(): CatalogGraph | null {
  return useContext(CatalogGraphContext);
}
