import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

import { loadRefactorings } from "./loadRefactorings";

/**
 * Returns the Kerievsky entries from the refactorings catalog —
 * the 27 composite refactorings whose destination is a GoF pattern.
 * Lives on the refactorings side because that's where the entries live
 * post-ADR-0007. See `KerievskyLandingPage` and the
 * `/refactoring-to-patterns/<slug>` route shims for consumers.
 */
export function loadKerievsky(): CatalogEntry[] {
  return loadRefactorings().filter((entry) => entry.book === "kerievsky");
}
