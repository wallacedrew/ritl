import { describe, expect, it } from "vitest";

import { AtlasNodeId } from "@/reference/atlas/lib/AtlasNodeId";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

describe("AtlasNodeId", () => {
  it("renders a smell name as 'smell:<slug>'", () => {
    const id = AtlasNodeId.fromCatalogEntryName(CatalogEntryName.smell("Long Function"));

    expect(id.toString()).toBe("smell:long-function");
    expect(id.layer).toBe("smell");
  });

  it("renders a refactoring name as 'refactoring:<slug>'", () => {
    const id = AtlasNodeId.fromCatalogEntryName(CatalogEntryName.refactoring("Extract Function"));

    expect(id.toString()).toBe("refactoring:extract-function");
    expect(id.layer).toBe("refactoring");
  });

  it("distinguishes Kerievsky and GoF patterns even when their names collide", () => {
    const kerievsky = AtlasNodeId.fromCatalogEntryName(
      CatalogEntryName.pattern("Factory Method", "kerievsky"),
    );
    const gof = AtlasNodeId.fromCatalogEntryName(CatalogEntryName.pattern("Factory Method", "gof"));

    expect(kerievsky.toString()).toBe("kerievsky-pattern:factory-method");
    expect(gof.toString()).toBe("gof-pattern:factory-method");
    expect(kerievsky.layer).toBe("kerievsky-pattern");
    expect(gof.layer).toBe("gof-pattern");
    expect(kerievsky.equals(gof)).toBe(false);
  });

  it("treats two ids over the same catalog name as equal", () => {
    const first = AtlasNodeId.fromCatalogEntryName(CatalogEntryName.smell("Long Function"));
    const second = AtlasNodeId.fromCatalogEntryName(CatalogEntryName.smell("Long Function"));

    expect(first.equals(second)).toBe(true);
  });
});
