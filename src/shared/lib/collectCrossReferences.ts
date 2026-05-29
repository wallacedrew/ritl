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

/**
 * Maximum chevron-nesting depth: top-level chip → its popover chips → their
 * popover chips. Beyond this, popover chips render plain (no chevron) so the
 * user can keep clicking deeper without an unbounded popover-stack of
 * sub-popovers.
 */
const DEFAULT_MAX_DEPTH = 1;

export function collectCrossReferences(
  entry: CatalogEntry,
  snapshot: CatalogSnapshot,
  innerChipDepth: number = DEFAULT_MAX_DEPTH,
): CrossReferences {
  const buildChip = (name: CatalogEntryName) => chipAtDepth(name, snapshot, innerChipDepth);
  switch (entry.name.tone()) {
    case "smell":
      return collectSmellCrossReferences(entry, snapshot, buildChip);
    case "refactoring":
      return collectRefactoringCrossReferences(entry, snapshot, buildChip);
    case "kerievsky-pattern":
      return collectKerievskyCrossReferences(entry, buildChip);
    case "gof-pattern":
      return collectGofCrossReferences(entry, snapshot, buildChip);
  }
}

function collectSmellCrossReferences(
  smell: CatalogEntry,
  snapshot: CatalogSnapshot,
  buildChip: (name: CatalogEntryName) => CrossReferenceChip,
): CrossReferences {
  return crossReferences([
    relationshipGroup("apply-refactorings", smell.nemeses.map(buildChip)),
    relationshipGroup(
      "referenced-by-patterns",
      findInboundPatterns(smell.name, snapshot.patterns).map((pattern) => buildChip(pattern.name)),
    ),
  ]);
}

function collectRefactoringCrossReferences(
  refactoring: CatalogEntry,
  snapshot: CatalogSnapshot,
  buildChip: (name: CatalogEntryName) => CrossReferenceChip,
): CrossReferences {
  return crossReferences([
    relationshipGroup("removes-smells", refactoring.nemeses.map(buildChip)),
    relationshipGroup(
      "referenced-by-patterns",
      findInboundPatterns(refactoring.name, snapshot.patterns).map((pattern) =>
        buildChip(pattern.name),
      ),
    ),
  ]);
}

function collectKerievskyCrossReferences(
  pattern: CatalogEntry,
  buildChip: (name: CatalogEntryName) => CrossReferenceChip,
): CrossReferences {
  const destination = pattern.destinationPattern;
  return crossReferences([
    relationshipGroup("triggered-by", pattern.nemeses.map(buildChip)),
    relationshipGroup("destination", destination ? [buildChip(destination)] : []),
  ]);
}

function collectGofCrossReferences(
  gof: CatalogEntry,
  snapshot: CatalogSnapshot,
  buildChip: (name: CatalogEntryName) => CrossReferenceChip,
): CrossReferences {
  return crossReferences([
    relationshipGroup(
      "reached-from",
      findPatternSources(gof.name, snapshot.patterns).map((pattern) => buildChip(pattern.name)),
    ),
  ]);
}

function chipAtDepth(
  name: CatalogEntryName,
  snapshot: CatalogSnapshot,
  remainingDepth: number,
): CrossReferenceChip {
  const baseChip: CrossReferenceChip = {
    label: name.toString(),
    href: name.toCatalogHref(),
    tone: name.tone(),
  };
  if (remainingDepth <= 0) return baseChip;
  const entry = findEntryByName(name, snapshot);
  if (!entry) return baseChip;
  return {
    ...baseChip,
    crossReferences: collectCrossReferences(entry, snapshot, remainingDepth - 1),
  };
}

function findEntryByName(
  name: CatalogEntryName,
  snapshot: CatalogSnapshot,
): CatalogEntry | undefined {
  const targetHref = name.toCatalogHref();
  const all = [...snapshot.smells, ...snapshot.refactorings, ...snapshot.patterns];
  return all.find((candidate) => candidate.name.toCatalogHref() === targetHref);
}
