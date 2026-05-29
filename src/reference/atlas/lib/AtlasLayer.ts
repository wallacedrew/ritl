import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";

export type AtlasLayer = CatalogEntryTone;

export const ATLAS_LAYERS_LEFT_TO_RIGHT: readonly AtlasLayer[] = [
  "smell",
  "refactoring",
  "kerievsky-pattern",
  "gof-pattern",
];

export const ATLAS_LAYER_HEADINGS: Readonly<Record<AtlasLayer, string>> = {
  smell: "Smells",
  refactoring: "Refactorings",
  "kerievsky-pattern": "Refactoring to Patterns",
  "gof-pattern": "Design Patterns",
};
