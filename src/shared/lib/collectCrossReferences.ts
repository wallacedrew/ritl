import { findPatternSources } from "@/patterns/lib/findPatternSources";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";

import {
  crossReferences,
  type CrossReferenceChip,
  type CrossReferences,
  relationshipGroup,
} from "./RelationshipGroup";

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
  return crossReferences([
    relationshipGroup("apply-refactorings", smell.nemeses.map(toChip)),
    relationshipGroup(
      "referenced-by-patterns",
      findInboundPatterns(smell.name, snapshot.patterns).map((pattern) => toChip(pattern.name)),
    ),
  ]);
}

function collectRefactoringCrossReferences(
  refactoring: CatalogEntry,
  snapshot: CatalogSnapshot,
): CrossReferences {
  return crossReferences([
    relationshipGroup("removes-smells", refactoring.nemeses.map(toChip)),
    relationshipGroup(
      "referenced-by-patterns",
      findInboundPatterns(refactoring.name, snapshot.patterns).map((pattern) =>
        toChip(pattern.name),
      ),
    ),
  ]);
}

function collectKerievskyCrossReferences(pattern: CatalogEntry): CrossReferences {
  const destination = pattern.destinationPattern;
  return crossReferences([
    relationshipGroup("triggered-by", pattern.nemeses.map(toChip)),
    relationshipGroup("destination", destination ? [toChip(destination)] : []),
  ]);
}

function collectGofCrossReferences(gof: CatalogEntry, snapshot: CatalogSnapshot): CrossReferences {
  return crossReferences([
    relationshipGroup(
      "reached-from",
      findPatternSources(gof.name, snapshot.patterns).map((pattern) => toChip(pattern.name)),
    ),
  ]);
}

function toChip(name: CatalogEntryName): CrossReferenceChip {
  return {
    label: name.toString(),
    href: name.toCatalogHref(),
    tone: name.tone(),
  };
}
