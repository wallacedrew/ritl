import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";

import type { CatalogItem } from "./CatalogItem";
import { slugify } from "./slugify";

export function loadCatalogItems(): CatalogItem[] {
  const smells: CatalogItem[] = loadSmells().map((smell, index) => ({
    kind: "smell",
    number: index + 1,
    name: smell.name,
    href: `/smells/${slugify(smell.name)}`,
  }));

  const refactorings: CatalogItem[] = loadRefactorings().map((refactoring, index) => ({
    kind: "refactoring",
    number: index + 1,
    name: refactoring.name,
    href: `/refactorings/${slugify(refactoring.name)}`,
  }));

  return [...refactorings, ...smells];
}
