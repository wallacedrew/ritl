import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";

import type { CatalogItem } from "./CatalogItem";
import { Slug } from "./Slug";

export function loadCatalogItems(): CatalogItem[] {
  const smells: CatalogItem[] = loadSmells().map((smell, index) => ({
    kind: "smell",
    number: index + 1,
    name: smell.name,
    href: Slug.from(smell.name).toCatalogHref("smells"),
  }));

  const refactorings: CatalogItem[] = loadRefactorings().map((refactoring, index) => ({
    kind: "refactoring",
    number: index + 1,
    name: refactoring.name,
    href: Slug.from(refactoring.name).toCatalogHref("refactorings"),
  }));

  return [...refactorings, ...smells];
}
