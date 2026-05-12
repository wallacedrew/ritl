import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

import { loadRefactorings } from "./loadRefactorings";
import { toRefactoringListItem } from "./toRefactoringListItem";

export function getRefactoringNeighbors(currentNumber: number): CatalogNeighbors {
  const items = loadRefactorings();
  const prevItem = currentNumber > 1 ? items[currentNumber - 2] : undefined;
  const nextItem = currentNumber < items.length ? items[currentNumber] : undefined;

  return {
    prev: prevItem ? toRefactoringListItem(prevItem, currentNumber - 1) : null,
    next: nextItem ? toRefactoringListItem(nextItem, currentNumber + 1) : null,
  };
}
