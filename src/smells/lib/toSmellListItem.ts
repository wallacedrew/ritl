import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

import type { Smell } from "./Smell";

export function toSmellListItem(smell: Smell, number: number): CatalogListItem {
  return {
    number,
    href: smell.name.toCatalogHref(),
    name: smell.name.toString(),
    chips: smell.refactorings.map((refactoringName) => refactoringName.toString()),
    caption: smell.symptom,
  };
}
