import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens, RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";

import { getRefactoringNeighbors } from "../lib/getRefactoringNeighbors";
import { loadKerievsky } from "../lib/loadKerievsky";
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
  const inboundPatternNames = findInboundPatterns(refactoring.name, [
    ...loadPatterns(),
    ...loadKerievsky(),
  ]).map((pattern) => pattern.name);
  const viewModel = toRefactoringDetailViewModel({
    refactoring,
    number,
    lens,
    book,
    inboundPatternNames,
    neighbors: getRefactoringNeighbors(number, book),
  });

  return <CatalogDetail viewModel={viewModel} lens={lens} />;
}
