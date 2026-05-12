import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";

import type { CatalogItem } from "./CatalogItem";

export function loadCatalogItems(): CatalogItem[] {
  const smells: CatalogItem[] = loadSmells().map((smell, index) => ({
    kind: "smell",
    number: index + 1,
    name: smell.name.toString(),
    href: smell.name.toCatalogHref(),
  }));

  const refactorings: CatalogItem[] = loadRefactorings().map((refactoring, index) => ({
    kind: "refactoring",
    number: index + 1,
    name: refactoring.name.toString(),
    href: refactoring.name.toCatalogHref(),
  }));

  return [...refactorings, ...smells];
}
