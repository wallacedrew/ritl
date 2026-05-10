import { describe, expect, it } from "vitest";

import type { Refactoring } from "@/refactorings/lib/Refactoring";
import { toRefactoringListItem } from "@/refactorings/lib/toRefactoringListItem";

const baseRefactoring: Refactoring = {
  name: "Extract Function",
  solves: ["Long Function", "Duplicated Code"],
  risk: "Maze of one-line functions if over-eager.",
  goal: "Each function reads as a single named domain step.",
  savings: "Bugs concentrate inside named subroutines.",
  before: "function ship(o) { /* big body */ }",
  after: "function ship(o) { validate(o); notify(o); }",
};

describe("toRefactoringListItem", () => {
  it("derives a slug-based href to the refactoring's detail page", () => {
    const item = toRefactoringListItem(baseRefactoring);

    expect(item.href).toBe("/refactorings/extract-function");
  });

  it("preserves name, solves, and goal for the list view", () => {
    const item = toRefactoringListItem(baseRefactoring);

    expect(item.name).toBe("Extract Function");
    expect(item.solves).toEqual(["Long Function", "Duplicated Code"]);
    expect(item.goal).toContain("single named");
  });

  it("does not leak detail-only fields onto the list item", () => {
    const item = toRefactoringListItem(baseRefactoring);

    expect(item).not.toHaveProperty("risk");
    expect(item).not.toHaveProperty("savings");
    expect(item).not.toHaveProperty("before");
    expect(item).not.toHaveProperty("after");
  });
});
