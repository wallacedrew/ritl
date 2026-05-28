import type { CatalogEntry } from "./CatalogEntry";
import type { CatalogEntryName } from "./CatalogEntryName";

/**
 * Inverse view of patterns' nemeses field.
 *
 * Given the name of a Fowler entry (refactoring or smell), returns every
 * pattern (across all books) whose nemeses list contains it. Used to
 * surface "this refactoring/smell is referenced by these patterns" on
 * the Fowler detail pages.
 */
export function findInboundPatterns(
  targetName: CatalogEntryName,
  allPatterns: readonly CatalogEntry[],
): readonly CatalogEntry[] {
  return allPatterns.filter((pattern) =>
    pattern.nemeses.some((nemesis) => nemesis.equals(targetName)),
  );
}
