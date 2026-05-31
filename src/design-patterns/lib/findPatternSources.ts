import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

/**
 * Inverse of CatalogEntry.destinationPattern.
 *
 * Given the name of a pattern entry, returns every other pattern entry
 * (in `allPatterns`) whose `destinationPattern` points at it. The match
 * is by full identity (name + book) via CatalogEntryName.equals.
 *
 * Used to surface "this GoF pattern is the destination of these Kerievsky
 * refactoring journeys" on the GoF detail page, and symmetrically if a
 * GoF entry ever declares a Kerievsky destinationPattern.
 */
export function findPatternSources(
  targetName: CatalogEntryName,
  allPatterns: readonly CatalogEntry[],
): readonly CatalogEntry[] {
  return allPatterns.filter((pattern) => {
    const dest = pattern.destinationPattern;
    return dest !== undefined && dest.equals(targetName);
  });
}
