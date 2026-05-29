import { loadPatterns } from "@/patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import type { CatalogSnapshot } from "@/shared/lib/collectCrossReferences";
import { loadSmells } from "@/smells/lib/loadSmells";

export function loadCatalogSnapshot(): CatalogSnapshot {
  return {
    refactorings: loadRefactorings(),
    smells: loadSmells(),
    patterns: loadPatterns(),
  };
}
