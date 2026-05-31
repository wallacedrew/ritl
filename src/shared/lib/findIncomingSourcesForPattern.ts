import { findPatternSources } from "@/design-patterns/lib/findPatternSources";
import { loadKerievsky } from "@/refactorings/lib/loadKerievsky";

import type { CatalogEntryName } from "./CatalogEntryName";

/**
 * The Kerievsky refactorings whose destinationPattern points at this
 * GoF pattern, projected to bare CatalogEntryNames. Post-ADR-0007 the
 * sources of a GoF pattern are Kerievsky refactorings — not other GoF
 * patterns — so this hides the load-from-kerievsky decision from the
 * pattern feature surface.
 */
export function findIncomingSourcesForPattern(
  patternName: CatalogEntryName,
): readonly CatalogEntryName[] {
  return findPatternSources(patternName, loadKerievsky()).map((source) => source.name);
}
