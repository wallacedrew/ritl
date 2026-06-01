import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { loadCatalogJson } from "@/shared/lib/loadCatalogJson";

import refactoringsData from "../content/refactorings.json";

export function loadRefactorings(): CatalogEntry[] {
  return loadCatalogJson({
    raw: refactoringsData,
    expectedCatalog: "refactorings",
    callerName: "loadRefactorings",
    sourceFile: "refactorings.json",
  });
}
