import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { parseCatalogEntry } from "@/shared/lib/parseCatalogEntry";

import refactoringsData from "../content/refactorings.json";

export function loadRefactorings(): CatalogEntry[] {
  const raw: unknown = refactoringsData;
  if (!Array.isArray(raw)) {
    throw new Error(
      "loadRefactorings: refactorings.json must be an array of catalog entry objects",
    );
  }
  return raw.map((rawEntry) => {
    const entry = parseCatalogEntry(rawEntry);
    if (entry.catalog !== "refactorings") {
      throw new Error(
        `loadRefactorings: expected catalog "refactorings" but got "${entry.catalog}" for ${entry.name.toString()}`,
      );
    }
    return entry;
  });
}
