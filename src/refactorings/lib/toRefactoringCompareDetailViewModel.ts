import type { CatalogEntry, RefactoringBook } from "@/shared/lib/CatalogEntry";
import type { CatalogCompareDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { buildCatalogDetailCore } from "@/shared/lib/buildCatalogDetailCore";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

import { backLinkForRefactoringBook } from "./backLinkForRefactoringBook";
import { REFACTORING_BEFORE_AFTER_LABELS } from "./refactoringLabels";

export interface RefactoringCompareDetailViewModelArgs {
  readonly refactoring: CatalogEntry;
  readonly number: number;
  readonly book: RefactoringBook;
  readonly inboundPatternNames: readonly CatalogEntryName[];
  readonly neighbors: CatalogNeighbors;
}

export function toRefactoringCompareDetailViewModel(
  args: RefactoringCompareDetailViewModelArgs,
): CatalogCompareDetailViewModel {
  const { refactoring, number, book, inboundPatternNames, neighbors } = args;
  const backLink = backLinkForRefactoringBook(book);
  return {
    ...buildCatalogDetailCore({
      entry: refactoring,
      number,
      relatedNames: refactoring.nemeses,
      destinationPattern: refactoring.destinationPattern,
      inboundPatternNames,
      neighbors,
      backLinkHref: backLink.href,
      backLinkLabel: backLink.label,
      ...REFACTORING_BEFORE_AFTER_LABELS,
    }),
    humanForces: toForcesRecord(refactoring.forcesFor("human")),
    agentForces: toForcesRecord(refactoring.forcesFor("agent")),
  };
}
