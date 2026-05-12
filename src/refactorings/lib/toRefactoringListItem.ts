import type { CatalogListItem } from "@/shared/lib/CatalogListItem";
import { Slug } from "@/shared/lib/Slug";

import type { Refactoring } from "./Refactoring";

export function toRefactoringListItem(refactoring: Refactoring, number: number): CatalogListItem {
  return {
    number,
    href: Slug.from(refactoring.name).toCatalogHref("refactorings"),
    name: refactoring.name,
    chips: refactoring.solves,
    caption: refactoring.goal,
  };
}
