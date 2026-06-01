import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { loadCatalogJson } from "@/shared/lib/loadCatalogJson";

import patternsData from "../content/design-patterns.json";

export function loadPatterns(): CatalogEntry[] {
  return loadCatalogJson({
    raw: patternsData,
    expectedCatalog: "design-patterns",
    callerName: "loadPatterns",
    sourceFile: "design-patterns.json",
  });
}
