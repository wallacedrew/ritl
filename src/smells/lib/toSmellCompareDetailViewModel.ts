import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogCompareDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { toCatalogEntryHeaderViewModel } from "@/shared/lib/toCatalogEntryHeaderViewModel";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

export interface SmellCompareDetailViewModelArgs {
  readonly smell: CatalogEntry;
  readonly number: number;
  readonly inboundPatternNames: readonly CatalogEntryName[];
  readonly neighbors: CatalogNeighbors;
}

export function toSmellCompareDetailViewModel(
  args: SmellCompareDetailViewModelArgs,
): CatalogCompareDetailViewModel {
  const { smell, number, inboundPatternNames, neighbors } = args;
  return {
    header: toCatalogEntryHeaderViewModel({
      name: smell.name,
      number,
      relatedNames: smell.nemeses,
      inboundPatternNames,
      neighbors,
    }),
    humanHref: smell.href(),
    agentHref: smell.agentHref(),
    compareHref: smell.compareHref(),
    snippetHref: smell.name.toSnippetHref(),
    backLinkHref: "/refactoring/smells",
    backLinkLabel: "Smells",
    beforeLabel: "Smellier version",
    afterLabel: "Fresher version",
    beforeCode: smell.before,
    afterCode: smell.after,
    exampleSource: smell.exampleSource,
    humanForces: toForcesRecord(smell.forcesFor("human")),
    agentForces: toForcesRecord(smell.forcesFor("agent")),
  };
}
