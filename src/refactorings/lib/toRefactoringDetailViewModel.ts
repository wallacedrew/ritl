import type { CatalogEntry, Lens, RefactoringBook } from "@/shared/lib/CatalogEntry";
import type { CatalogDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { toCatalogEntryHeaderViewModel } from "@/shared/lib/toCatalogEntryHeaderViewModel";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

import { backLinkForRefactoringBook } from "./backLinkForRefactoringBook";

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
    forces: toForcesRecord(refactoring.forcesFor(lens)),
  };
}
