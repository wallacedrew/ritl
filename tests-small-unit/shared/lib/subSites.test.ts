import { describe, expect, it } from "vitest";

import { FOWLER, KERIEVSKY, SUB_SITES, subSiteForCatalog } from "@/shared/lib/subSites";

describe("subSites registry", () => {
  it("declares Fowler at /refactoring with refactorings and smells", () => {
    expect(FOWLER.slug).toBe("refactoring");
    expect(FOWLER.title).toBe("Refactoring");
    expect(FOWLER.catalogs).toEqual(["refactorings", "smells"]);
  });

  it("declares Kerievsky at /refactoring-to-patterns with the patterns catalog", () => {
    expect(KERIEVSKY.slug).toBe("refactoring-to-patterns");
    expect(KERIEVSKY.title).toBe("Refactoring to Patterns");
    expect(KERIEVSKY.catalogs).toEqual(["patterns"]);
  });

  it("exposes Fowler and Kerievsky as the registered sub-sites", () => {
    expect(SUB_SITES).toHaveLength(2);
    expect(SUB_SITES[0]?.equals(FOWLER)).toBe(true);
    expect(SUB_SITES[1]?.equals(KERIEVSKY)).toBe(true);
  });

  it("subSiteForCatalog returns Fowler for refactorings", () => {
    expect(subSiteForCatalog("refactorings").equals(FOWLER)).toBe(true);
  });

  it("subSiteForCatalog returns Fowler for smells", () => {
    expect(subSiteForCatalog("smells").equals(FOWLER)).toBe(true);
  });

  it("subSiteForCatalog returns Kerievsky for patterns", () => {
    expect(subSiteForCatalog("patterns").equals(KERIEVSKY)).toBe(true);
  });
});
