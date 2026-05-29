import { describe, expect, it } from "vitest";

import {
  crossReferences,
  emptyCrossReferences,
  isEmptyCrossReferences,
  relationshipGroup,
  totalCrossReferenceCount,
  type RelationshipKind,
} from "@/reference/lib/RelationshipGroup";

describe("relationshipGroup", () => {
  it("attaches the canonical label for its kind", () => {
    const group = relationshipGroup("apply-refactorings", [
      {
        label: "Extract Function",
        href: "/refactoring/canon/extract-function",
        tone: "refactoring",
      },
    ]);

    expect(group.label).toBe("Apply refactorings");
    expect(group.kind).toBe("apply-refactorings");
    expect(group.chips).toHaveLength(1);
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
      expect(relationshipGroup(kind, []).label).toBe(expected);
    }
  });
});

describe("crossReferences", () => {
  it("drops empty groups when constructed", () => {
    const populated = relationshipGroup("apply-refactorings", [
      {
        label: "Extract Function",
        href: "/refactoring/canon/extract-function",
        tone: "refactoring",
      },
    ]);
    const empty = relationshipGroup("referenced-by-patterns", []);

    const value = crossReferences([populated, empty]);

    expect(value.groups).toHaveLength(1);
    expect(value.groups[0]?.kind).toBe("apply-refactorings");
  });

  it("reports an empty cross-reference set when given no non-empty groups", () => {
    expect(isEmptyCrossReferences(crossReferences([]))).toBe(true);
    expect(isEmptyCrossReferences(emptyCrossReferences())).toBe(true);
  });

  it("sums the total number of connected chips across all groups", () => {
    const refactorings = relationshipGroup("apply-refactorings", [
      {
        label: "Extract Function",
        href: "/refactoring/canon/extract-function",
        tone: "refactoring",
      },
      {
        label: "Replace Temp with Query",
        href: "/refactoring/canon/replace-temp-with-query",
        tone: "refactoring",
      },
    ]);
    const patterns = relationshipGroup("referenced-by-patterns", [
      {
        label: "Compose Method",
        href: "/refactoring-to-patterns/compose-method",
        tone: "kerievsky-pattern",
      },
    ]);

    expect(totalCrossReferenceCount(crossReferences([refactorings, patterns]))).toBe(3);
  });
});
