import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

import { loadRefactorings } from "./loadRefactorings";

/**
 * Returns the Fowler entries from the refactorings catalog —
 * everything except the Kerievsky composite refactorings, which live
 * under the `/refactoring-to-patterns/<slug>` shelf. See
 * `RefactoringsPage` and the `/refactoring/canon/<slug>` route shims
 * for consumers.
 */
export function loadFowlerRefactorings(): CatalogEntry[] {
  return loadRefactorings().filter((entry) => entry.book !== "kerievsky");
}
