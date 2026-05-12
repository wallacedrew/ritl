import { Slug } from "@/shared/lib/Slug";

import type { Refactoring } from "./Refactoring";
import type { RefactoringListItem } from "./RefactoringListItem";

export function toRefactoringListItem(
  refactoring: Refactoring,
  number: number,
): RefactoringListItem {
  return {
    number,
    href: Slug.from(refactoring.name).toCatalogHref("refactorings"),
    name: refactoring.name,
    solves: refactoring.solves,
    goal: refactoring.goal,
  };
}
