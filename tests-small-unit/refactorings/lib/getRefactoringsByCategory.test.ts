import { describe, expect, it } from "vitest";

import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { getRefactoringsByCategory } from "@/refactorings/lib/getRefactoringsByCategory";

describe("getRefactoringsByCategory", () => {
  it("groups refactorings under their Fowler category", () => {
    const groups = getRefactoringsByCategory();

    const composing = groups.find((g) => g.category === "Composing Methods");
    expect(composing).toBeDefined();
    expect(composing?.items.map((i) => i.name)).toContain("Extract Function");
    expect(composing?.items.map((i) => i.name)).toContain("Inline Function");
  });

  it("returns the categories in their declaration order", () => {
    const groups = getRefactoringsByCategory();

    expect(groups.map((g) => g.category)).toEqual([
      "Composing Methods",
      "Encapsulation",
      "Moving Features",
      "Organizing Data",
      "Simplifying Conditional Logic",
      "Refactoring APIs",
      "Inheritance",
    ]);
  });

  it("emits items as RefactoringListItem view models with pre-resolved hrefs", () => {
    const groups = getRefactoringsByCategory();

    const composing = groups.find((g) => g.category === "Composing Methods");
    const extractFunction = composing?.items.find((i) => i.name === "Extract Function");
    expect(extractFunction?.href).toBe("/refactorings/extract-function");
    expect(extractFunction?.solves).toContain("Long Function");
  });

  it("categorizes every refactoring in the catalog (no orphans)", () => {
    const allNames = loadRefactorings().map((r) => r.name);
    const categorizedNames = getRefactoringsByCategory().flatMap((g) => g.items.map((i) => i.name));

    for (const name of allNames) {
      expect(categorizedNames).toContain(name);
    }
  });
});
