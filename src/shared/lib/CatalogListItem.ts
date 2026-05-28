import type { CatalogEntryTone } from "./CatalogEntry";

export interface CatalogListItemChip {
  label: string;
  tone: CatalogEntryTone;
}

export interface CatalogListItem {
  number: number;
  href: string;
  name: string;
  chips: readonly CatalogListItemChip[];
  caption: string;
}
