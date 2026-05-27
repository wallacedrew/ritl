import { describe, expect, it } from "vitest";

import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

describe("CatalogEntryName", () => {
  it("rejects an empty refactoring name at construction", () => {
    expect(() => CatalogEntryName.refactoring("")).toThrow(/cannot be empty/);
    expect(() => CatalogEntryName.refactoring("   ")).toThrow(/cannot be empty/);
  });

  it("rejects an empty smell name at construction", () => {
    expect(() => CatalogEntryName.smell("")).toThrow(/cannot be empty/);
  });

  it("rejects an empty pattern name at construction", () => {
    expect(() => CatalogEntryName.pattern("")).toThrow(/cannot be empty/);
  });

  it("treats a pattern name distinct from a refactoring name with the same value", () => {
    const asRefactoring = CatalogEntryName.refactoring("Compose Method");
    const asPattern = CatalogEntryName.pattern("Compose Method");

    expect(asRefactoring.equals(asPattern)).toBe(false);
  });

  it("renders refactoring URLs under the refactorings kind", () => {
    const name = CatalogEntryName.refactoring("Extract Function");

    expect(name.toCatalogHref()).toBe("/refactoring/refactorings/extract-function");
    expect(name.toSnippetHref()).toBe("/snippets/refactorings/extract-function.md");
  });

  it("renders smell URLs under the smells kind", () => {
    const name = CatalogEntryName.smell("Mysterious Name");

    expect(name.toCatalogHref()).toBe("/refactoring/smells/mysterious-name");
    expect(name.toSnippetHref()).toBe("/snippets/smells/mysterious-name.md");
  });

  it("toString returns the canonical display value", () => {
    expect(CatalogEntryName.refactoring("Extract Function").toString()).toBe("Extract Function");
  });

  it("treats names of different kinds as unequal even when the value matches", () => {
    const asRefactoring = CatalogEntryName.refactoring("Same Name");
    const asSmell = CatalogEntryName.smell("Same Name");

    expect(asRefactoring.equals(asSmell)).toBe(false);
  });

  it("treats names of the same kind and value as equal", () => {
    const a = CatalogEntryName.refactoring("Extract Function");
    const b = CatalogEntryName.refactoring("Extract Function");

    expect(a.equals(b)).toBe(true);
  });
});
