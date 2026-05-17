import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { parseCatalogEntry } from "@/shared/lib/parseCatalogEntry";

import smellsData from "../content/smells.json";

export function loadSmells(): CatalogEntry[] {
  const raw: unknown = smellsData;
  if (!Array.isArray(raw)) {
    throw new Error("loadSmells: smells.json must be an array of catalog entry objects");
  }
  return raw.map((rawEntry) => {
    const entry = parseCatalogEntry(rawEntry);
    if (entry.catalog !== "smells") {
      throw new Error(
        `loadSmells: expected catalog "smells" but got "${entry.catalog}" for ${entry.name.toString()}`,
      );
    }
    return entry;
  });
}
