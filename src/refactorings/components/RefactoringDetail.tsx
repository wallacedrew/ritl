import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens, RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findInboundPatternsForRefactoring } from "@/shared/lib/findInboundPatternsForRefactoring";

import { getRefactoringNeighbors } from "../lib/getRefactoringNeighbors";
import { toRefactoringDetailViewModel } from "../lib/toRefactoringDetailViewModel";

interface RefactoringDetailProps {
  refactoring: CatalogEntry;
  number: number;
  lens: Lens;
  book?: RefactoringBook;
}

export default function RefactoringDetail({
  refactoring,
  number,
  lens,
  book = "fowler",
}: RefactoringDetailProps) {
  const viewModel = toRefactoringDetailViewModel({
    refactoring,
    number,
    lens,
    book,
    inboundPatternNames: findInboundPatternsForRefactoring(refactoring.name),
    neighbors: getRefactoringNeighbors(number, book),
  });

  return <CatalogDetail viewModel={viewModel} lens={lens} />;
}
