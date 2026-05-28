import type { CatalogEntryTone } from "./CatalogEntry";

export interface CatalogItem {
  kind: "smell" | "refactoring" | "pattern";
  tone: CatalogEntryTone;
  number: number;
  name: string;
  href: string;
}
