import { describe, expect, it } from "vitest";

import { loadCatalogItems } from "@/shared/lib/loadCatalogItems";

describe("loadCatalogItems", () => {
  it("combines 24 smells and 66 refactorings into a single 90-item catalog", () => {
    const items = loadCatalogItems();

    expect(items).toHaveLength(90);
    expect(items.filter((i) => i.kind === "smell")).toHaveLength(24);
    expect(items.filter((i) => i.kind === "refactoring")).toHaveLength(66);
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
    expect(longFunction?.href).toBe("/smells/long-function");

    const extractFunction = items.find(
      (i) => i.name === "Extract Function" && i.kind === "refactoring",
    );
    expect(extractFunction?.href).toBe("/refactorings/extract-function");
  });
});
