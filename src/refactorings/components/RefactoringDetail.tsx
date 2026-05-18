import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

import { getRefactoringNeighbors } from "../lib/getRefactoringNeighbors";

interface RefactoringDetailProps {
  refactoring: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function RefactoringDetail({ refactoring, number, lens }: RefactoringDetailProps) {
  return (
    <CatalogDetail
      entry={refactoring}
      number={number}
      lens={lens}
      backLinkHref="/"
      backLinkLabel="Refactorings"
      beforeLabel="Before the refactoring"
      afterLabel="After the refactoring"
      neighbors={getRefactoringNeighbors(number)}
    />
  );
}
