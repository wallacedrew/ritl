"use client";

import { createContext, type ReactNode } from "react";

import type { CatalogGraph } from "@/shared/lib/CatalogGraph";

export const CatalogGraphContext = createContext<CatalogGraph | null>(null);

interface CatalogGraphProviderProps {
  graph: CatalogGraph;
  children: ReactNode;
}

export function CatalogGraphProvider({ graph, children }: CatalogGraphProviderProps) {
  return <CatalogGraphContext.Provider value={graph}>{children}</CatalogGraphContext.Provider>;
}
