import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

import { getRefactoringNeighbors } from "../lib/getRefactoringNeighbors";

interface RefactoringDetailProps {
  refactoring: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function RefactoringDetail({ refactoring, number, lens }: RefactoringDetailProps) {
  const snapshot = loadCatalogSnapshot();
  const inboundPatterns = findInboundPatterns(refactoring.name, snapshot.patterns).map(
    (pattern) => pattern.name,
  );

  return (
    <CatalogDetail
      entry={refactoring}
      number={number}
      lens={lens}
      backLinkHref="/refactoring/canon"
      backLinkLabel="Refactorings"
      beforeLabel="Before the refactoring"
      afterLabel="After the refactoring"
      neighbors={getRefactoringNeighbors(number)}
      inboundPatterns={inboundPatterns}
      snapshot={snapshot}
    />
  );
}
