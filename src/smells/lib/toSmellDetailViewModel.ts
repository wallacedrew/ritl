import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import type { CatalogDetailViewModel } from "@/shared/lib/CatalogDetailViewModel";
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
    ...buildCatalogDetailCore({
      entry: smell,
      number,
      relatedNames: smell.nemeses,
      inboundPatternNames,
      neighbors,
      ...SMELL_LABELS,
    }),
    forces: toForcesRecord(smell.forcesFor(lens)),
  };
}
