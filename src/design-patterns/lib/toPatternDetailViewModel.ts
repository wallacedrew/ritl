import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import type { CatalogDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { GOF } from "@/shared/lib/subSites";
import { toCatalogEntryHeaderViewModel } from "@/shared/lib/toCatalogEntryHeaderViewModel";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

export interface PatternDetailViewModelArgs {
  readonly pattern: CatalogEntry;
  readonly number: number;
  readonly lens: Lens;
  readonly incomingSourceNames: readonly CatalogEntryName[];
  readonly neighbors: CatalogNeighbors;
}

export function toPatternDetailViewModel(args: PatternDetailViewModelArgs): CatalogDetailViewModel {
  const { pattern, number, lens, incomingSourceNames, neighbors } = args;
  return {
    header: toCatalogEntryHeaderViewModel({
      name: pattern.name,
      number,
      relatedNames: pattern.nemeses,
      destinationPattern: pattern.destinationPattern,
      incomingSourceNames,
      neighbors,
    }),
    humanHref: pattern.href(),
    agentHref: pattern.agentHref(),
    compareHref: pattern.compareHref(),
    snippetHref: pattern.name.toSnippetHref(),
    backLinkHref: GOF.href(),
    backLinkLabel: "Patterns",
    beforeLabel: "Before the pattern",
    afterLabel: "After the pattern",
    beforeCode: pattern.before,
    afterCode: pattern.after,
    exampleSource: pattern.exampleSource,
    forces: toForcesRecord(pattern.forcesFor(lens)),
  };
}
