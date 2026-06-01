import type { CatalogEntry, Lens, RefactoringBook } from "@/shared/lib/CatalogEntry";
import type { CatalogDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { buildCatalogDetailCore } from "@/shared/lib/buildCatalogDetailCore";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

import { refactoringLabelsForBook } from "./refactoringLabels";

export interface RefactoringDetailViewModelArgs {
  readonly refactoring: CatalogEntry;
  readonly number: number;
  readonly lens: Lens;
  readonly book: RefactoringBook;
  readonly inboundPatternNames: readonly CatalogEntryName[];
  readonly neighbors: CatalogNeighbors;
}

export function toRefactoringDetailViewModel(
  args: RefactoringDetailViewModelArgs,
): CatalogDetailViewModel {
  const { refactoring, number, lens, book, inboundPatternNames, neighbors } = args;
  return {
    ...buildCatalogDetailCore({
      entry: refactoring,
      number,
      relatedNames: refactoring.nemeses,
      destinationPattern: refactoring.destinationPattern,
      inboundPatternNames,
      neighbors,
      ...refactoringLabelsForBook(book),
    }),
    forces: toForcesRecord(refactoring.forcesFor(lens)),
  };
}
