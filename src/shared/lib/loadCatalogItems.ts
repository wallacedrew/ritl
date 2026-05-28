import { loadPatterns } from "@/patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";

import type { CatalogItem } from "./CatalogItem";

export function loadCatalogItems(): CatalogItem[] {
  const smells: CatalogItem[] = loadSmells().map((smell, index) => ({
    kind: "smell",
    tone: smell.name.tone(),
    number: index + 1,
    name: smell.name.toString(),
    href: smell.name.toCatalogHref(),
  }));

  const refactorings: CatalogItem[] = loadRefactorings().map((refactoring, index) => ({
    kind: "refactoring",
    tone: refactoring.name.tone(),
    number: index + 1,
    name: refactoring.name.toString(),
    href: refactoring.name.toCatalogHref(),
  }));

  const patterns: CatalogItem[] = loadPatterns().map((pattern, index) => ({
    kind: "pattern",
    tone: pattern.name.tone(),
    number: index + 1,
    name: pattern.name.toString(),
    href: pattern.name.toCatalogHref(),
  }));

  return [...refactorings, ...smells, ...patterns];
}
