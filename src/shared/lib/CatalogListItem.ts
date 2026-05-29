import type { CrossReferences } from "@/shared/lib/RelationshipGroup";

import type { CatalogEntryTone } from "./CatalogEntry";

export interface CatalogListItemChip {
  label: string;
  tone: CatalogEntryTone;
}

export interface CatalogListItem {
  number: number;
  href: string;
  name: string;
  tone: CatalogEntryTone;
  chips: readonly CatalogListItemChip[];
  caption: string;
  crossReferences?: CrossReferences;
}
