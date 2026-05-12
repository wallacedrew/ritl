import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

import { loadSmells } from "./loadSmells";
import { toSmellListItem } from "./toSmellListItem";

export function getSmellNeighbors(currentNumber: number): CatalogNeighbors {
  const items = loadSmells();
  const prevItem = currentNumber > 1 ? items[currentNumber - 2] : undefined;
  const nextItem = currentNumber < items.length ? items[currentNumber] : undefined;

  return {
    prev: prevItem ? toSmellListItem(prevItem, currentNumber - 1) : null,
    next: nextItem ? toSmellListItem(nextItem, currentNumber + 1) : null,
  };
}
