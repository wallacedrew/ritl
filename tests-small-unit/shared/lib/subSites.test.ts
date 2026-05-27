import { describe, expect, it } from "vitest";

import { FOWLER, SUB_SITES, subSiteForCatalog } from "@/shared/lib/subSites";

describe("subSites registry", () => {
  it("declares Fowler at /refactoring with refactorings and smells", () => {
    expect(FOWLER.slug).toBe("refactoring");
    expect(FOWLER.title).toBe("Refactoring");
    expect(FOWLER.catalogs).toEqual(["refactorings", "smells"]);
  });

  it("exposes Fowler as the only sub-site for now", () => {
    expect(SUB_SITES).toHaveLength(1);
    expect(SUB_SITES[0]?.equals(FOWLER)).toBe(true);
  });

  it("subSiteForCatalog returns Fowler for refactorings", () => {
    expect(subSiteForCatalog("refactorings").equals(FOWLER)).toBe(true);
  });

  it("subSiteForCatalog returns Fowler for smells", () => {
    expect(subSiteForCatalog("smells").equals(FOWLER)).toBe(true);
  });
});
