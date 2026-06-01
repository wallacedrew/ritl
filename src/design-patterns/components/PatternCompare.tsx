import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { findIncomingSourcesForPattern } from "@/shared/lib/findIncomingSourcesForPattern";

import { getPatternNeighbors } from "../lib/getPatternNeighbors";
import { toPatternCompareDetailViewModel } from "../lib/toPatternCompareDetailViewModel";

interface PatternCompareProps {
  pattern: CatalogEntry;
  number: number;
}

export default function PatternCompare({ pattern, number }: PatternCompareProps) {
  const viewModel = toPatternCompareDetailViewModel({
    pattern,
    number,
    incomingSourceNames: findIncomingSourcesForPattern(pattern.name),
    neighbors: getPatternNeighbors(number),
  });

  return <CatalogCompareDetail viewModel={viewModel} />;
}
