import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import type { CatalogDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { toCatalogEntryHeaderViewModel } from "@/shared/lib/toCatalogEntryHeaderViewModel";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

export interface SmellDetailViewModelArgs {
  readonly smell: CatalogEntry;
  readonly number: number;
  readonly lens: Lens;
  readonly inboundPatternNames: readonly CatalogEntryName[];
  readonly neighbors: CatalogNeighbors;
}

export function toSmellDetailViewModel(args: SmellDetailViewModelArgs): CatalogDetailViewModel {
  const { smell, number, lens, inboundPatternNames, neighbors } = args;
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
    forces: toForcesRecord(smell.forcesFor(lens)),
  };
}
