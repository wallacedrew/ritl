import { describe, expect, it } from "vitest";

import {
  CrossReferences,
  RelationshipGroup,
  type RelationshipKind,
} from "@/reference/lib/RelationshipGroup";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

describe("RelationshipGroup", () => {
  it("attaches the canonical label for its kind", () => {
    const group = RelationshipGroup.of("apply-refactorings", [
      CatalogEntryName.refactoring("Extract Function"),
    ]);

    expect(group.label).toBe("Apply refactorings");
    expect(group.kind).toBe("apply-refactorings");
  });

  it("treats a zero-entry group as empty", () => {
    expect(RelationshipGroup.of("removes-smells", []).isEmpty()).toBe(true);
  });

  it("uses the existing detail-page vocabulary for every relationship kind", () => {
    const labelByKind: Record<RelationshipKind, string> = {
      "apply-refactorings": "Apply refactorings",
      "removes-smells": "Removes smells",
      "triggered-by": "Triggered by",
      destination: "Destination",
      "reached-from": "Reached from",
      "referenced-by-patterns": "Referenced by patterns",
    };
    for (const [kind, expected] of Object.entries(labelByKind) as Array<
      [RelationshipKind, string]
    >) {
      expect(RelationshipGroup.of(kind, []).label).toBe(expected);
    }
  });
});

describe("CrossReferences", () => {
  it("drops empty groups when constructed", () => {
    const populated = RelationshipGroup.of("apply-refactorings", [
      CatalogEntryName.refactoring("Extract Function"),
    ]);
    const empty = RelationshipGroup.of("referenced-by-patterns", []);

    const crossReferences = CrossReferences.of([populated, empty]);

    expect(crossReferences.groups).toHaveLength(1);
    expect(crossReferences.groups[0]?.kind).toBe("apply-refactorings");
  });

  it("reports an empty cross-reference set when given no non-empty groups", () => {
    expect(CrossReferences.of([]).isEmpty()).toBe(true);
    expect(CrossReferences.empty().isEmpty()).toBe(true);
  });

  it("sums the total number of connected entries across all groups", () => {
    const refactorings = RelationshipGroup.of("apply-refactorings", [
      CatalogEntryName.refactoring("Extract Function"),
      CatalogEntryName.refactoring("Replace Temp with Query"),
    ]);
    const patterns = RelationshipGroup.of("referenced-by-patterns", [
      CatalogEntryName.pattern("Compose Method", "kerievsky"),
    ]);

    expect(CrossReferences.of([refactorings, patterns]).totalEntries()).toBe(3);
  });
});
