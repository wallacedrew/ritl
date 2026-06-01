import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";

import type { CatalogEntry } from "./CatalogEntry";
import type { CatalogItem } from "./CatalogItem";

function toCatalogItems(
  load: () => readonly CatalogEntry[],
  kind: CatalogItem["kind"],
): CatalogItem[] {
  return load().map((entry, index) => ({
    kind,
    tone: entry.name.tone(),
    number: index + 1,
    name: entry.name.toString(),
    href: entry.name.toCatalogHref(),
  }));
}

export function loadCatalogItems(): CatalogItem[] {
  return [
    ...toCatalogItems(loadRefactorings, "refactoring"),
    ...toCatalogItems(loadSmells, "smell"),
    ...toCatalogItems(loadPatterns, "pattern"),
  ];
}
