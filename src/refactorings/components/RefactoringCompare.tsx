import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import type { CatalogEntry, RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findInboundPatternsForRefactoring } from "@/shared/lib/findInboundPatternsForRefactoring";

import { getRefactoringNeighbors } from "../lib/getRefactoringNeighbors";
import { toRefactoringCompareDetailViewModel } from "../lib/toRefactoringCompareDetailViewModel";

interface RefactoringCompareProps {
  refactoring: CatalogEntry;
  number: number;
  book?: RefactoringBook;
}

export default function RefactoringCompare({
  refactoring,
  number,
  book = "fowler",
}: RefactoringCompareProps) {
  const viewModel = toRefactoringCompareDetailViewModel({
    refactoring,
    number,
    book,
    inboundPatternNames: findInboundPatternsForRefactoring(refactoring.name),
    neighbors: getRefactoringNeighbors(number, book),
  });

  return <CatalogCompareDetail viewModel={viewModel} />;
}
