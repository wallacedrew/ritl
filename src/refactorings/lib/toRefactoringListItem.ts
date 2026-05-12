import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

import type { Refactoring } from "./Refactoring";

export function toRefactoringListItem(refactoring: Refactoring, number: number): CatalogListItem {
  return {
    number,
    href: refactoring.name.toCatalogHref(),
    name: refactoring.name.toString(),
    chips: refactoring.solves.map((smellName) => smellName.toString()),
    caption: refactoring.goal,
  };
}
