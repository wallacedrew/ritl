import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { loadCatalogJson } from "@/shared/lib/loadCatalogJson";

import smellsData from "../content/smells.json";

export function loadSmells(): CatalogEntry[] {
  return loadCatalogJson({
    raw: smellsData,
    expectedCatalog: "smells",
    callerName: "loadSmells",
    sourceFile: "smells.json",
  });
}
