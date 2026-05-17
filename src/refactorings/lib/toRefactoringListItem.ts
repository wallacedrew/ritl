import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

export function toRefactoringListItem(refactoring: CatalogEntry, number: number): CatalogListItem {
  return {
    number,
    href: refactoring.name.toCatalogHref(),
    name: refactoring.name.toString(),
    chips: refactoring.nemeses.map((smellName) => smellName.toString()),
    caption: refactoring.forcesFor("human").goal,
  };
}
