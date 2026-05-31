import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadKerievsky } from "@/refactorings/lib/loadKerievsky";

import type { CatalogEntryName } from "./CatalogEntryName";
import { findInboundPatterns } from "./findInboundPatterns";

/**
 * The pattern-shaped inbound references to this refactoring, projected
 * to bare CatalogEntryNames. Refactorings scan both the GoF catalog
 * and the Kerievsky shelf because Kerievsky entries (post-ADR-0007)
 * are refactorings whose nemeses can target Fowler refactorings — so
 * "referenced by patterns" on a Fowler entry must include its
 * Kerievsky inbound chain too. Hides that rule from the feature
 * surface.
 */
export function findInboundPatternsForRefactoring(
  refactoringName: CatalogEntryName,
): readonly CatalogEntryName[] {
  return findInboundPatterns(refactoringName, [...loadPatterns(), ...loadKerievsky()]).map(
    (pattern) => pattern.name,
  );
}
