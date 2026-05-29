import { loadPatterns } from "@/patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { loadSmells } from "@/smells/lib/loadSmells";

export interface CatalogSnapshot {
  readonly refactorings: readonly CatalogEntry[];
  readonly smells: readonly CatalogEntry[];
  readonly patterns: readonly CatalogEntry[];
}

export function loadCatalogSnapshot(): CatalogSnapshot {
  return {
    refactorings: loadRefactorings(),
    smells: loadSmells(),
    patterns: loadPatterns(),
  };
}
