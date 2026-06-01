import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import type { CatalogDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
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
    ...buildCatalogDetailCore({
      entry: pattern,
      number,
      relatedNames: pattern.nemeses,
      destinationPattern: pattern.destinationPattern,
      incomingSourceNames,
      neighbors,
      ...PATTERN_LABELS,
    }),
    forces: toForcesRecord(pattern.forcesFor(lens)),
  };
}
