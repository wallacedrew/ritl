import type { PatternBook } from "@/shared/lib/CatalogEntry";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";

import { loadPatterns } from "./loadPatterns";
import { toPatternListItem } from "./toPatternListItem";

export function getPatternNeighbors(currentNumber: number, book: PatternBook): CatalogNeighbors {
  const items = loadPatterns(book);
  const prevItem = currentNumber > 1 ? items[currentNumber - 2] : undefined;
  const nextItem = currentNumber < items.length ? items[currentNumber] : undefined;

  return {
    prev: prevItem ? toPatternListItem(prevItem, currentNumber - 1) : null,
    next: nextItem ? toPatternListItem(nextItem, currentNumber + 1) : null,
  };
}
