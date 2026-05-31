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
    expect(() => CatalogEntryName.pattern("", "kerievsky")).toThrow(/cannot be empty/);
  });

  it("treats a pattern name distinct from a refactoring name with the same value", () => {
    const asRefactoring = CatalogEntryName.refactoring("Compose Method");
    const asPattern = CatalogEntryName.pattern("Compose Method", "kerievsky");

    expect(asRefactoring.equals(asPattern)).toBe(false);
  });

  it("treats two pattern names with the same value but different books as unequal", () => {
    const kerievsky = CatalogEntryName.pattern("Strategy", "kerievsky");
    const gof = CatalogEntryName.pattern("Strategy", "gof");

    expect(kerievsky.equals(gof)).toBe(false);
  });

  it("routes a kerievsky refactoring URL under /refactoring-to-patterns", () => {
    const name = CatalogEntryName.refactoring("Compose Method", "kerievsky");

    expect(name.toCatalogHref()).toBe("/refactoring-to-patterns/compose-method");
  });

  it("routes a gof pattern URL under /design-patterns", () => {
    const name = CatalogEntryName.pattern("Strategy", "gof");

    expect(name.toCatalogHref()).toBe("/design-patterns/strategy");
  });

  it("renders refactoring URLs under the refactorings kind", () => {
    const name = CatalogEntryName.refactoring("Extract Function");

    expect(name.toCatalogHref()).toBe("/refactoring/canon/extract-function");
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

  it("derives the chip tone from kind and book", () => {
    expect(CatalogEntryName.refactoring("Extract Function").tone()).toBe("fowler-refactoring");
    expect(CatalogEntryName.refactoring("Extract Function", "fowler").tone()).toBe(
      "fowler-refactoring",
    );
    expect(
      CatalogEntryName.refactoring("Replace Conditional Logic with Strategy", "kerievsky").tone(),
    ).toBe("kerievsky-refactoring");
    expect(CatalogEntryName.smell("Long Function").tone()).toBe("smell");
    expect(CatalogEntryName.pattern("Compose Method", "kerievsky").tone()).toBe(
      "kerievsky-refactoring",
    );
    expect(CatalogEntryName.pattern("Strategy", "gof").tone()).toBe("pattern");
  });
});
