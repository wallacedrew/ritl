import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

import { REFACTORING_CATEGORIES } from "./categories";
import { loadFowlerRefactorings } from "./loadFowlerRefactorings";
import { toRefactoringListItem } from "./toRefactoringListItem";

export interface RefactoringCategoryGroup {
  category: string;
  items: CatalogListItem[];
}

export function getRefactoringsByCategory(): RefactoringCategoryGroup[] {
  return groupByCategory(buildFowlerItemIndex());
}

function buildFowlerItemIndex(): Map<string, CatalogListItem> {
  return new Map(
    loadFowlerRefactorings().map((refactoring, index) => [
      refactoring.name.toString(),
      toRefactoringListItem(refactoring, index + 1),
    ]),
  );
}

function groupByCategory(itemByName: Map<string, CatalogListItem>): RefactoringCategoryGroup[] {
  return Object.entries(REFACTORING_CATEGORIES).map(([category, names]) => ({
    category,
    items: names.flatMap((name) => {
      const item = itemByName.get(name);
      return item ? [item] : [];
    }),
  }));
}
