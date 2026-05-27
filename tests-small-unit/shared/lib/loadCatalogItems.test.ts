import { describe, expect, it } from "vitest";

import { loadCatalogItems } from "@/shared/lib/loadCatalogItems";

describe("loadCatalogItems", () => {
  it("combines 24 smells, 66 refactorings, and 7 patterns into a single 97-item catalog", () => {
    const items = loadCatalogItems();

    expect(items).toHaveLength(97);
    expect(items.filter((i) => i.kind === "smell")).toHaveLength(24);
    expect(items.filter((i) => i.kind === "refactoring")).toHaveLength(66);
    expect(items.filter((i) => i.kind === "pattern")).toHaveLength(7);
  });

  it("lists refactorings, then smells, then patterns", () => {
    const items = loadCatalogItems();

    expect(items[0]?.kind).toBe("refactoring");
    expect(items[65]?.kind).toBe("refactoring");
    expect(items[66]?.kind).toBe("smell");
    expect(items[89]?.kind).toBe("smell");
    expect(items[90]?.kind).toBe("pattern");
    expect(items[96]?.kind).toBe("pattern");
  });

  it("assigns each entity its 1-based position as the catalog number", () => {
    const items = loadCatalogItems();

    const longFunction = items.find((i) => i.name === "Long Function" && i.kind === "smell");
    expect(longFunction?.number).toBe(3);

    const extractFunction = items.find(
      (i) => i.name === "Extract Function" && i.kind === "refactoring",
    );
    expect(extractFunction?.number).toBe(1);
  });

  it("includes the href to each entity's detail page", () => {
    const items = loadCatalogItems();

    const longFunction = items.find((i) => i.name === "Long Function" && i.kind === "smell");
    expect(longFunction?.href).toBe("/refactoring/smells/long-function");

    const extractFunction = items.find(
      (i) => i.name === "Extract Function" && i.kind === "refactoring",
    );
    expect(extractFunction?.href).toBe("/refactoring/refactorings/extract-function");
  });
});
