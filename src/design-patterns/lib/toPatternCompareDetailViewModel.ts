import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogCompareDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogNeighbors } from "@/shared/lib/CatalogNeighbors";
import { buildCatalogDetailCore } from "@/shared/lib/buildCatalogDetailCore";
import { GOF } from "@/shared/lib/subSites";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

const PATTERN_LABELS = {
  backLinkHref: GOF.href(),
  backLinkLabel: "Patterns",
  beforeLabel: "Before the pattern",
  afterLabel: "After the pattern",
} as const;

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
    ...buildCatalogDetailCore({
      entry: pattern,
      number,
      relatedNames: pattern.nemeses,
      destinationPattern: pattern.destinationPattern,
      incomingSourceNames,
      neighbors,
      ...PATTERN_LABELS,
    }),
    humanForces: toForcesRecord(pattern.forcesFor("human")),
    agentForces: toForcesRecord(pattern.forcesFor("agent")),
  };
}
