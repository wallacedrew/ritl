import { describe, expect, it } from "vitest";

import { loadFowlerRefactorings } from "@/refactorings/lib/loadFowlerRefactorings";
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
      "Basic Refactorings",
      "Composing Methods",
      "Encapsulation",
      "Moving Features",
      "Organizing Data",
      "Simplifying Conditional Logic",
      "Refactoring APIs",
      "Dealing with Inheritance",
    ]);
  });

  it("emits items as CatalogListItem view models with pre-resolved hrefs and catalog numbers", () => {
    const groups = getRefactoringsByCategory();

    const composing = groups.find((g) => g.category === "Composing Methods");
    const extractFunction = composing?.items.find((i) => i.name === "Extract Function");
    expect(extractFunction?.href).toBe("/refactoring/canon/extract-function");
    expect(extractFunction?.number).toBe(1);
    expect(extractFunction?.tone).toBe("fowler-refactoring");
  });

  it("categorizes every Fowler refactoring in the catalog (no orphans)", () => {
    const allNames = loadFowlerRefactorings().map((r) => r.name.toString());
    const categorizedNames = getRefactoringsByCategory().flatMap((g) => g.items.map((i) => i.name));

    for (const name of allNames) {
      expect(categorizedNames).toContain(name);
    }
  });
});
