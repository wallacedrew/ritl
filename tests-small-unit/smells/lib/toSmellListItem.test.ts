import { describe, expect, it } from "vitest";

import { toSmellListItem } from "@/smells/lib/toSmellListItem";
import type { Smell } from "@/smells/lib/Smell";

const baseSmell: Smell = {
  name: "Mysterious Name",
  symptom: "Names that don't reveal intent.",
  risk: "Re-comprehension cost.",
  refactoring: "Rename Variable",
  goal: "Names read as the domain.",
  savings: "Faster reading.",
  before: "x",
  after: "y",
};

describe("toSmellListItem", () => {
  it("preserves name, refactoring, and symptom for the list view", () => {
    const item = toSmellListItem(baseSmell);

    expect(item.name).toBe("Mysterious Name");
    expect(item.refactoring).toBe("Rename Variable");
    expect(item.symptom).toContain("don't reveal intent");
  });

  it("does not leak detail-only fields onto the list item", () => {
    const item = toSmellListItem(baseSmell);

    expect(item).not.toHaveProperty("risk");
    expect(item).not.toHaveProperty("goal");
    expect(item).not.toHaveProperty("savings");
    expect(item).not.toHaveProperty("before");
    expect(item).not.toHaveProperty("after");
  });
});
