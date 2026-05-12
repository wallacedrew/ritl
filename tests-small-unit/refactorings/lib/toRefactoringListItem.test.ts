import { describe, expect, it } from "vitest";

import type { Refactoring } from "@/refactorings/lib/Refactoring";
import { toRefactoringListItem } from "@/refactorings/lib/toRefactoringListItem";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

const baseRefactoring: Refactoring = {
  name: CatalogEntryName.refactoring("Extract Function"),
  solves: [CatalogEntryName.smell("Long Function"), CatalogEntryName.smell("Duplicated Code")],
  risk: "Maze of one-line functions if over-eager.",
  goal: "Each function reads as a single named domain step.",
  savings: "Bugs concentrate inside named subroutines.",
  before: "function ship(o) { /* big body */ }",
  after: "function ship(o) { validate(o); notify(o); }",
};

describe("toRefactoringListItem", () => {
  it("attaches the catalog number passed in", () => {
    const item = toRefactoringListItem(baseRefactoring, 13);

    expect(item.number).toBe(13);
  });

  it("derives a slug-based href to the refactoring's detail page", () => {
    const item = toRefactoringListItem(baseRefactoring, 1);

    expect(item.href).toBe("/refactorings/extract-function");
  });

  it("projects name + solves and goal into the generic chips + caption shape", () => {
    const item = toRefactoringListItem(baseRefactoring, 1);

    expect(item.name).toBe("Extract Function");
    expect(item.chips).toEqual(["Long Function", "Duplicated Code"]);
    expect(item.caption).toContain("single named");
  });

  it("does not leak detail-only fields onto the list item", () => {
    const item = toRefactoringListItem(baseRefactoring, 1);

    expect(item).not.toHaveProperty("risk");
    expect(item).not.toHaveProperty("savings");
    expect(item).not.toHaveProperty("before");
    expect(item).not.toHaveProperty("after");
  });
});
