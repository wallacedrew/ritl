import { REFACTORING_CATEGORIES } from "./categories";
import { loadRefactorings } from "./loadRefactorings";
import type { RefactoringListItem } from "./RefactoringListItem";
import { toRefactoringListItem } from "./toRefactoringListItem";

export interface RefactoringCategoryGroup {
  category: string;
  items: RefactoringListItem[];
}

export function getRefactoringsByCategory(): RefactoringCategoryGroup[] {
  const byName = new Map(loadRefactorings().map((r) => [r.name, r]));

  return Object.entries(REFACTORING_CATEGORIES).map(([category, names]) => ({
    category,
    items: names.flatMap((name) => {
      const refactoring = byName.get(name);
      return refactoring ? [toRefactoringListItem(refactoring)] : [];
    }),
  }));
}
