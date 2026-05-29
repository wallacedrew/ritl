import type { CrossReferences } from "@/shared/lib/RelationshipGroup";

import type { CatalogEntryTone } from "./CatalogEntry";

export interface CatalogListItem {
  number: number;
  href: string;
  name: string;
  tone: CatalogEntryTone;
  caption: string;
  crossReferences?: CrossReferences;
}
