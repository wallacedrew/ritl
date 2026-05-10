import type { Refactoring } from "./Refactoring";
import type { RefactoringListItem } from "./RefactoringListItem";

export function toRefactoringListItem(refactoring: Refactoring): RefactoringListItem {
  return {
    name: refactoring.name,
    solves: refactoring.solves,
    goal: refactoring.goal,
  };
}
