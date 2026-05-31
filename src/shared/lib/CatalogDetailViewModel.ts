import type { CatalogEntryTone } from "./CatalogEntry";
import type { CatalogNeighbors } from "./CatalogNeighbors";
import type { ForcesRecord } from "./Forces";

/**
 * View-model types consumed by the detail-tier render surfaces
 * (CatalogDetail, CatalogDetailBody, CatalogEntryHeader,
 * CatalogCompareDetail). Each value is a primitive (string, number,
 * tone tag) or a plain readonly array of them. No domain entity
 * (CatalogEntry, CatalogEntryName, Forces, SubSite) crosses this
 * boundary — everything the view needs is precomputed by the
 * to*DetailViewModel factories in each feature's lib/.
 */

export interface DetailChip {
  readonly label: string;
  readonly href: string;
  readonly tone: CatalogEntryTone;
}

export interface CatalogEntryHeaderViewModel {
  readonly title: string;
  readonly number: number;
  readonly nemesesLabel: string;
  readonly relatedChips: readonly DetailChip[];
  readonly destinationChip?: DetailChip;
  readonly incomingSourceChips?: readonly DetailChip[];
  readonly inboundPatternChips?: readonly DetailChip[];
  readonly neighbors?: CatalogNeighbors;
}

interface DetailHrefs {
  readonly humanHref: string;
  readonly agentHref: string;
  readonly compareHref: string;
  readonly snippetHref: string;
}

interface DetailLabels {
  readonly backLinkHref: string;
  readonly backLinkLabel: string;
  readonly beforeLabel: string;
  readonly afterLabel: string;
}

interface DetailContent {
  readonly beforeCode: string;
  readonly afterCode: string;
  readonly exampleSource?: string;
}

export interface CatalogDetailViewModel extends DetailHrefs, DetailLabels, DetailContent {
  readonly header: CatalogEntryHeaderViewModel;
  readonly forces: ForcesRecord;
}

export interface CatalogCompareDetailViewModel extends DetailHrefs, DetailLabels, DetailContent {
  readonly header: CatalogEntryHeaderViewModel;
  readonly humanForces: ForcesRecord;
  readonly agentForces: ForcesRecord;
}
