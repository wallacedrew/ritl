import type { CatalogEntry } from "./CatalogEntry";
import type {
  CatalogCompareDetailViewModel,
  CatalogDetailViewModel,
  CatalogEntryHeaderViewModel,
} from "./CatalogDetailViewModel";
import type { CatalogEntryName } from "./CatalogEntryName";
import type { CatalogNeighbors } from "./CatalogNeighbors";
import { toCatalogEntryHeaderViewModel } from "./toCatalogEntryHeaderViewModel";

/**
 * Per-catalog inputs to the shared detail-tier assembly. Each
 * to*DetailViewModel / to*CompareDetailViewModel factory supplies:
 *
 * - the entity (read for hrefs, before/after, exampleSource);
 * - the row's catalog number;
 * - the header's outbound relationship arrays;
 * - the catalog's back-link target;
 * - the per-catalog before/after labels;
 * - pre-shaped CatalogNeighbors.
 *
 * The shared core projects this into the fields shared by both
 * detail and compare view models; the per-catalog factory layers the
 * forces (single lens for detail, both lenses for compare) on top.
 */
export interface CatalogDetailCoreArgs {
  readonly entry: CatalogEntry;
  readonly number: number;
  readonly relatedNames: readonly CatalogEntryName[];
  readonly destinationPattern?: CatalogEntryName;
  readonly incomingSourceNames?: readonly CatalogEntryName[];
  readonly inboundPatternNames?: readonly CatalogEntryName[];
  readonly neighbors: CatalogNeighbors;
  readonly backLinkHref: string;
  readonly backLinkLabel: string;
  readonly beforeLabel: string;
  readonly afterLabel: string;
}

export type CatalogDetailCoreFields = Omit<CatalogDetailViewModel, "forces"> & {
  readonly header: CatalogEntryHeaderViewModel;
};

// Compile-time assertion: the core fields cover everything the
// compare view model needs apart from the two forces records.
type _CompareAlignment = Exclude<
  keyof CatalogCompareDetailViewModel,
  keyof CatalogDetailCoreFields | "humanForces" | "agentForces"
>;
const _compareAlignmentCheck: _CompareAlignment[] = [];
void _compareAlignmentCheck;

export function buildCatalogDetailCore(args: CatalogDetailCoreArgs): CatalogDetailCoreFields {
  const {
    entry,
    number,
    relatedNames,
    destinationPattern,
    incomingSourceNames,
    inboundPatternNames,
    neighbors,
    backLinkHref,
    backLinkLabel,
    beforeLabel,
    afterLabel,
  } = args;
  return {
    header: toCatalogEntryHeaderViewModel({
      name: entry.name,
      number,
      relatedNames,
      destinationPattern,
      incomingSourceNames,
      inboundPatternNames,
      neighbors,
    }),
    humanHref: entry.href(),
    agentHref: entry.agentHref(),
    compareHref: entry.compareHref(),
    snippetHref: entry.name.toSnippetHref(),
    backLinkHref,
    backLinkLabel,
    beforeLabel,
    afterLabel,
    beforeCode: entry.before,
    afterCode: entry.after,
    exampleSource: entry.exampleSource,
  };
}
