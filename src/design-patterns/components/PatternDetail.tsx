import { loadKerievsky } from "@/refactorings/lib/loadKerievsky";
import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

import { findPatternSources } from "../lib/findPatternSources";
import { getPatternNeighbors } from "../lib/getPatternNeighbors";
import { toPatternDetailViewModel } from "../lib/toPatternDetailViewModel";

interface PatternDetailProps {
  pattern: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function PatternDetail({ pattern, number, lens }: PatternDetailProps) {
  // Sources of a GoF pattern post-ADR-0007 are Kerievsky refactorings that
  // declare `destinationPattern: { book: "gof", ... }`.
  const incomingSourceNames = findPatternSources(pattern.name, loadKerievsky()).map(
    (source) => source.name,
  );
  const viewModel = toPatternDetailViewModel({
    pattern,
    number,
    lens,
    incomingSourceNames,
    neighbors: getPatternNeighbors(number),
  });

  return <CatalogDetail viewModel={viewModel} lens={lens} />;
}
