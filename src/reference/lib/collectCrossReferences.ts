import { findPatternSources } from "@/patterns/lib/findPatternSources";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";

import { CrossReferences, RelationshipGroup } from "./RelationshipGroup";

export interface CatalogSnapshot {
  readonly refactorings: readonly CatalogEntry[];
  readonly smells: readonly CatalogEntry[];
  readonly patterns: readonly CatalogEntry[];
}

export function collectCrossReferences(
  entry: CatalogEntry,
  snapshot: CatalogSnapshot,
): CrossReferences {
  switch (entry.name.tone()) {
    case "smell":
      return collectSmellCrossReferences(entry, snapshot);
    case "refactoring":
      return collectRefactoringCrossReferences(entry, snapshot);
    case "kerievsky-pattern":
      return collectKerievskyCrossReferences(entry);
    case "gof-pattern":
      return collectGofCrossReferences(entry, snapshot);
  }
}

function collectSmellCrossReferences(
  smell: CatalogEntry,
  snapshot: CatalogSnapshot,
): CrossReferences {
  return CrossReferences.of([
    RelationshipGroup.of("apply-refactorings", smell.nemeses),
    RelationshipGroup.of(
      "referenced-by-patterns",
      findInboundPatterns(smell.name, snapshot.patterns).map((pattern) => pattern.name),
    ),
  ]);
}

function collectRefactoringCrossReferences(
  refactoring: CatalogEntry,
  snapshot: CatalogSnapshot,
): CrossReferences {
  return CrossReferences.of([
    RelationshipGroup.of("removes-smells", refactoring.nemeses),
    RelationshipGroup.of(
      "referenced-by-patterns",
      findInboundPatterns(refactoring.name, snapshot.patterns).map((pattern) => pattern.name),
    ),
  ]);
}

function collectKerievskyCrossReferences(pattern: CatalogEntry): CrossReferences {
  const destination = pattern.destinationPattern;
  return CrossReferences.of([
    RelationshipGroup.of("triggered-by", pattern.nemeses),
    RelationshipGroup.of("destination", destination ? [destination] : []),
  ]);
}

function collectGofCrossReferences(gof: CatalogEntry, snapshot: CatalogSnapshot): CrossReferences {
  return CrossReferences.of([
    RelationshipGroup.of(
      "reached-from",
      findPatternSources(gof.name, snapshot.patterns).map((pattern) => pattern.name),
    ),
  ]);
}
