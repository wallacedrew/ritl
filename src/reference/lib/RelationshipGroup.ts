import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

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

export class RelationshipGroup {
  private constructor(
    readonly kind: RelationshipKind,
    readonly label: string,
    readonly entries: readonly CatalogEntryName[],
  ) {}

  static of(kind: RelationshipKind, entries: readonly CatalogEntryName[]): RelationshipGroup {
    return new RelationshipGroup(kind, RELATIONSHIP_LABELS[kind], entries);
  }

  isEmpty(): boolean {
    return this.entries.length === 0;
  }
}

export class CrossReferences {
  private constructor(readonly groups: readonly RelationshipGroup[]) {}

  static of(groups: readonly RelationshipGroup[]): CrossReferences {
    return new CrossReferences(groups.filter((group) => !group.isEmpty()));
  }

  static empty(): CrossReferences {
    return new CrossReferences([]);
  }

  isEmpty(): boolean {
    return this.groups.length === 0;
  }

  totalEntries(): number {
    return this.groups.reduce((sum, group) => sum + group.entries.length, 0);
  }
}
