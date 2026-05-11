import { slugify } from "@/shared/lib/slugify";

import type { Refactoring } from "./Refactoring";
import type { RefactoringListItem } from "./RefactoringListItem";

export function toRefactoringListItem(
  refactoring: Refactoring,
  number: number,
): RefactoringListItem {
  return {
    number,
    href: `/refactorings/${slugify(refactoring.name)}`,
    name: refactoring.name,
    solves: refactoring.solves,
    goal: refactoring.goal,
  };
}
