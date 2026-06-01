import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogCompareDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { buildCatalogDetailCore } from "@/shared/lib/buildCatalogDetailCore";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

const SMELL_LABELS = {
  backLinkHref: "/refactoring/smells",
  backLinkLabel: "Smells",
  beforeLabel: "Smellier version",
  afterLabel: "Fresher version",
} as const;

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
    ...buildCatalogDetailCore({
      entry: smell,
      number,
      relatedNames: smell.nemeses,
      inboundPatternNames,
      neighbors,
      ...SMELL_LABELS,
    }),
    humanForces: toForcesRecord(smell.forcesFor("human")),
    agentForces: toForcesRecord(smell.forcesFor("agent")),
  };
}
