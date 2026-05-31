import type { CatalogEntry, RefactoringBook } from "@/shared/lib/CatalogEntry";
import type { CatalogCompareDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { toCatalogEntryHeaderViewModel } from "@/shared/lib/toCatalogEntryHeaderViewModel";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

import { backLinkForRefactoringBook } from "./backLinkForRefactoringBook";

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
    header: toCatalogEntryHeaderViewModel({
      name: refactoring.name,
      number,
      relatedNames: refactoring.nemeses,
      destinationPattern: refactoring.destinationPattern,
      inboundPatternNames,
      neighbors,
    }),
    humanHref: refactoring.href(),
    agentHref: refactoring.agentHref(),
    compareHref: refactoring.compareHref(),
    snippetHref: refactoring.name.toSnippetHref(),
    backLinkHref: backLink.href,
    backLinkLabel: backLink.label,
    beforeLabel: "Before the refactoring",
    afterLabel: "After the refactoring",
    beforeCode: refactoring.before,
    afterCode: refactoring.after,
    exampleSource: refactoring.exampleSource,
    humanForces: toForcesRecord(refactoring.forcesFor("human")),
    agentForces: toForcesRecord(refactoring.forcesFor("agent")),
  };
}
