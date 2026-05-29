import { loadPatterns } from "@/patterns/lib/loadPatterns";
import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";

import { getRefactoringNeighbors } from "../lib/getRefactoringNeighbors";

interface RefactoringDetailProps {
  refactoring: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function RefactoringDetail({ refactoring, number, lens }: RefactoringDetailProps) {
  const inboundPatterns = findInboundPatterns(refactoring.name, loadPatterns()).map(
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
    />
  );
}
