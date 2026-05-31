import { loadPatterns } from "@/design-patterns/lib/loadPatterns";

import type { CatalogEntryName } from "./CatalogEntryName";
import { findInboundPatterns } from "./findInboundPatterns";

/**
 * The GoF patterns whose nemeses list contains this smell, projected
 * to bare CatalogEntryNames. Hides the "smells only scan GoF patterns
 * for inbound references" rule from the feature surface so each
 * detail/compare page can stay catalog-blind.
 */
export function findInboundPatternsForSmell(
  smellName: CatalogEntryName,
): readonly CatalogEntryName[] {
  return findInboundPatterns(smellName, loadPatterns()).map((pattern) => pattern.name);
}
