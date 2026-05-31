import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

import { REFACTORING_CATEGORIES } from "./categories";
import { loadFowlerRefactorings } from "./loadFowlerRefactorings";
import { toRefactoringListItem } from "./toRefactoringListItem";

export interface RefactoringCategoryGroup {
  category: string;
  items: CatalogListItem[];
}

export function getRefactoringsByCategory(): RefactoringCategoryGroup[] {
  const fowlerRefactorings = loadFowlerRefactorings();
  const byName = new Map(
    fowlerRefactorings.map((refactoring, index) => [
      refactoring.name.toString(),
      { refactoring, number: index + 1 },
    ]),
  );

  return Object.entries(REFACTORING_CATEGORIES).map(([category, names]) => ({
    category,
    items: names.flatMap((name) => {
      const entry = byName.get(name);
      return entry ? [toRefactoringListItem(entry.refactoring, entry.number)] : [];
    }),
  }));
}
