import { describe, expect, it } from "vitest";

import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";
import { toRefactoringListItem } from "@/refactorings/lib/toRefactoringListItem";

const baseForcesRecord = {
  symptom: "Long function with mixed concerns.",
  goal: "Each function reads as a single named domain step.",
  pressure: "Reading speed drops with every additional line.",
  tradeoff: "Maze of one-line functions if over-eager.",
  relief: "Bugs concentrate inside named subroutines.",
  trap: "Workflow becomes harder to skim.",
};

const baseRefactoring = CatalogEntry.from({
  catalog: "refactorings",
  name: CatalogEntryName.refactoring("Extract Function"),
  nemeses: [CatalogEntryName.smell("Long Function"), CatalogEntryName.smell("Duplicated Code")],
  before: "function ship(o) { /* big body */ }",
  after: "function ship(o) { validate(o); notify(o); }",
  forces: {
    human: Forces.from(baseForcesRecord),
    agent: Forces.from(baseForcesRecord),
  },
});

describe("toRefactoringListItem", () => {
  it("attaches the catalog number passed in", () => {
    const item = toRefactoringListItem(baseRefactoring, 13);

    expect(item.number).toBe(13);
  });

  it("derives a slug-based href to the refactoring's detail page", () => {
    const item = toRefactoringListItem(baseRefactoring, 1);

    expect(item.href).toBe("/refactorings/extract-function");
  });

  it("projects name + nemeses and human-lens goal into the generic chips + caption shape", () => {
    const item = toRefactoringListItem(baseRefactoring, 1);

    expect(item.name).toBe("Extract Function");
    expect(item.chips).toEqual(["Long Function", "Duplicated Code"]);
    expect(item.caption).toContain("single named");
  });

  it("does not leak detail-only fields onto the list item", () => {
    const item = toRefactoringListItem(baseRefactoring, 1);

    expect(item).not.toHaveProperty("forces");
    expect(item).not.toHaveProperty("before");
    expect(item).not.toHaveProperty("after");
  });
});
