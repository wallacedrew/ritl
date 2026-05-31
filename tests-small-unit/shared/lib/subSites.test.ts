import { describe, expect, it } from "vitest";

import {
  FOWLER,
  GOF,
  KERIEVSKY,
  SUB_SITES,
  subSiteForCatalog,
  subSiteForPatternBook,
} from "@/shared/lib/subSites";

describe("subSites registry", () => {
  it("declares Fowler at /refactoring with refactorings and smells", () => {
    expect(FOWLER.slug).toBe("refactoring");
    expect(FOWLER.title).toBe("Refactoring");
    expect(FOWLER.catalogs).toEqual(["refactorings", "smells"]);
  });

  it("declares Kerievsky at /refactoring-to-patterns with the refactorings catalog", () => {
    expect(KERIEVSKY.slug).toBe("refactoring-to-patterns");
    expect(KERIEVSKY.title).toBe("Refactoring to Patterns");
    expect(KERIEVSKY.catalogs).toEqual(["refactorings"]);
  });

  it("declares GoF at /design-patterns with the patterns catalog", () => {
    expect(GOF.slug).toBe("design-patterns");
    expect(GOF.title).toBe("Design Patterns");
    expect(GOF.catalogs).toEqual(["design-patterns"]);
  });

  it("exposes Fowler, Kerievsky, and GoF as the registered sub-sites", () => {
    expect(SUB_SITES).toHaveLength(3);
    expect(SUB_SITES[0]?.equals(FOWLER)).toBe(true);
    expect(SUB_SITES[1]?.equals(KERIEVSKY)).toBe(true);
    expect(SUB_SITES[2]?.equals(GOF)).toBe(true);
  });

  it("subSiteForCatalog returns Fowler for refactorings", () => {
    expect(subSiteForCatalog("refactorings").equals(FOWLER)).toBe(true);
  });

  it("subSiteForCatalog returns Fowler for smells", () => {
    expect(subSiteForCatalog("smells").equals(FOWLER)).toBe(true);
  });

  it("subSiteForPatternBook returns Kerievsky for the kerievsky book", () => {
    expect(subSiteForPatternBook("kerievsky").equals(KERIEVSKY)).toBe(true);
  });

  it("subSiteForPatternBook returns GoF for the gof book", () => {
    expect(subSiteForPatternBook("gof").equals(GOF)).toBe(true);
  });
});
