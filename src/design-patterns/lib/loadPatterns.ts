import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { parseCatalogEntry } from "@/shared/lib/parseCatalogEntry";

import patternsData from "../content/patterns.json";

export function loadPatterns(): CatalogEntry[] {
  const raw: unknown = patternsData;
  if (!Array.isArray(raw)) {
    throw new Error("loadPatterns: patterns.json must be an array of catalog entry objects");
  }
  return raw.map((rawEntry) => {
    const entry = parseCatalogEntry(rawEntry);
    if (entry.catalog !== "patterns") {
      throw new Error(
        `loadPatterns: expected catalog "patterns" but got "${entry.catalog}" for ${entry.name.toString()}`,
      );
    }
    return entry;
  });
}
