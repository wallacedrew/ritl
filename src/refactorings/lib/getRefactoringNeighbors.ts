import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

import { loadFowlerRefactorings } from "./loadFowlerRefactorings";
import { loadKerievsky } from "./loadKerievsky";
import { toRefactoringListItem } from "./toRefactoringListItem";

export function getRefactoringNeighbors(
  currentNumber: number,
  book: RefactoringBook = "fowler",
): CatalogNeighbors {
  const items = book === "kerievsky" ? loadKerievsky() : loadFowlerRefactorings();
  const prevItem = currentNumber > 1 ? items[currentNumber - 2] : undefined;
  const nextItem = currentNumber < items.length ? items[currentNumber] : undefined;

  return {
    prev: prevItem ? toRefactoringListItem(prevItem, currentNumber - 1) : null,
    next: nextItem ? toRefactoringListItem(nextItem, currentNumber + 1) : null,
  };
}
