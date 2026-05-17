import { describe, expect, it } from "vitest";

import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";
import { toSmellListItem } from "@/smells/lib/toSmellListItem";

const baseForcesRecord = {
  symptom: "Names that don't reveal intent.",
  goal: "Names read as the domain.",
  pressure: "Re-comprehension cost.",
  tradeoff: "Cost of the rename ripples cross-file.",
  relief: "Faster reading.",
  trap: "Obsessive renaming churn.",
};

const baseSmell = CatalogEntry.from({
  catalog: "smells",
  name: CatalogEntryName.smell("Mysterious Name"),
  nemeses: [CatalogEntryName.refactoring("Rename Variable")],
  before: "x",
  after: "y",
  forces: { human: Forces.from(baseForcesRecord) },
});

describe("toSmellListItem", () => {
  it("attaches the catalog number passed in", () => {
    const item = toSmellListItem(baseSmell, 7);

    expect(item.number).toBe(7);
  });

  it("derives a slug-based href to the smell's detail page", () => {
    const item = toSmellListItem(baseSmell, 1);

    expect(item.href).toBe("/smells/mysterious-name");
  });

  it("projects name + nemeses and human-lens symptom into the generic chips + caption shape", () => {
    const item = toSmellListItem(baseSmell, 1);

    expect(item.name).toBe("Mysterious Name");
    expect(item.chips).toEqual(["Rename Variable"]);
    expect(item.caption).toContain("don't reveal intent");
  });

  it("does not leak detail-only fields onto the list item", () => {
    const item = toSmellListItem(baseSmell, 1);

    expect(item).not.toHaveProperty("forces");
    expect(item).not.toHaveProperty("before");
    expect(item).not.toHaveProperty("after");
  });
});
