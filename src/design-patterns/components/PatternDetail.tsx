import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { findIncomingSourcesForPattern } from "@/shared/lib/findIncomingSourcesForPattern";

import { getPatternNeighbors } from "../lib/getPatternNeighbors";
import { toPatternDetailViewModel } from "../lib/toPatternDetailViewModel";

interface PatternDetailProps {
  pattern: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function PatternDetail({ pattern, number, lens }: PatternDetailProps) {
  const viewModel = toPatternDetailViewModel({
    pattern,
    number,
    lens,
    incomingSourceNames: findIncomingSourcesForPattern(pattern.name),
    neighbors: getPatternNeighbors(number),
  });

  return <CatalogDetail viewModel={viewModel} lens={lens} />;
}
