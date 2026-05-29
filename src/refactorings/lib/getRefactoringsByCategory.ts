import type { CatalogSnapshot } from "@/shared/lib/collectCrossReferences";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

import { REFACTORING_CATEGORIES } from "./categories";
import { loadRefactorings } from "./loadRefactorings";
import { toRefactoringListItem } from "./toRefactoringListItem";

export interface RefactoringCategoryGroup {
  category: string;
  items: CatalogListItem[];
}

export function getRefactoringsByCategory(snapshot?: CatalogSnapshot): RefactoringCategoryGroup[] {
  const allRefactorings = loadRefactorings();
  const byName = new Map(
    allRefactorings.map((refactoring, index) => [
      refactoring.name.toString(),
      { refactoring, number: index + 1 },
    ]),
  );

  return Object.entries(REFACTORING_CATEGORIES).map(([category, names]) => ({
    category,
    items: names.flatMap((name) => {
      const entry = byName.get(name);
      return entry ? [toRefactoringListItem(entry.refactoring, entry.number, snapshot)] : [];
    }),
  }));
}
