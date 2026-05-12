import type { CatalogListItem } from "./CatalogListItem";

export interface CatalogNeighbors {
  prev: CatalogListItem | null;
  next: CatalogListItem | null;
}
