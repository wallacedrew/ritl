import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";

export type RelationshipKind =
  | "apply-refactorings"
  | "removes-smells"
  | "triggered-by"
  | "destination"
  | "reached-from"
  | "referenced-by-patterns";

const RELATIONSHIP_LABELS: Readonly<Record<RelationshipKind, string>> = {
  "apply-refactorings": "Apply refactorings",
  "removes-smells": "Removes smells",
  "triggered-by": "Triggered by",
  destination: "Destination",
  "reached-from": "Reached from",
  "referenced-by-patterns": "Referenced by patterns",
};

export interface CrossReferenceChip {
  readonly label: string;
  readonly href: string;
  readonly tone: CatalogEntryTone;
  /**
   * Populated when this chip should render its own cross-reference chevron
   * (i.e. when shown as a top-level chip on a render surface). Chips that
   * live inside a cross-reference popover leave this undefined — the
   * popover is itself an expansion and does not nest expansions.
   */
  readonly crossReferences?: CrossReferences;
}

export interface RelationshipGroup {
  readonly kind: RelationshipKind;
  readonly label: string;
  readonly chips: readonly CrossReferenceChip[];
}

export interface CrossReferences {
  readonly groups: readonly RelationshipGroup[];
}

export function relationshipGroup(
  kind: RelationshipKind,
  chips: readonly CrossReferenceChip[],
): RelationshipGroup {
  return { kind, label: RELATIONSHIP_LABELS[kind], chips };
}

export function isEmptyRelationshipGroup(group: RelationshipGroup): boolean {
  return group.chips.length === 0;
}

export function crossReferences(groups: readonly RelationshipGroup[]): CrossReferences {
  return { groups: groups.filter((group) => !isEmptyRelationshipGroup(group)) };
}

export function emptyCrossReferences(): CrossReferences {
  return { groups: [] };
}

export function isEmptyCrossReferences(value: CrossReferences): boolean {
  return value.groups.length === 0;
}

export function totalCrossReferenceCount(value: CrossReferences): number {
  return value.groups.reduce((sum, group) => sum + group.chips.length, 0);
}
