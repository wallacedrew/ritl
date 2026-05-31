import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogCompareDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { GOF } from "@/shared/lib/subSites";
import { toCatalogEntryHeaderViewModel } from "@/shared/lib/toCatalogEntryHeaderViewModel";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

export interface PatternCompareDetailViewModelArgs {
  readonly pattern: CatalogEntry;
  readonly number: number;
  readonly incomingSourceNames: readonly CatalogEntryName[];
  readonly neighbors: CatalogNeighbors;
}

export function toPatternCompareDetailViewModel(
  args: PatternCompareDetailViewModelArgs,
): CatalogCompareDetailViewModel {
  const { pattern, number, incomingSourceNames, neighbors } = args;
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
    humanForces: toForcesRecord(pattern.forcesFor("human")),
    agentForces: toForcesRecord(pattern.forcesFor("agent")),
  };
}
