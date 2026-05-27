import { describe, expect, it } from "vitest";

import { SubSite } from "@/shared/lib/SubSite";

describe("SubSite value object", () => {
  it("builds a sub-site from its slug, title, and catalogs", () => {
    const fowler = SubSite.from({
      slug: "refactoring",
      title: "Refactoring",
      catalogs: ["refactorings", "smells"],
    });

    expect(fowler.slug).toBe("refactoring");
    expect(fowler.title).toBe("Refactoring");
    expect(fowler.catalogs).toEqual(["refactorings", "smells"]);
  });

  it("rejects an empty slug", () => {
    expect(() =>
      SubSite.from({ slug: "  ", title: "Refactoring", catalogs: ["refactorings"] }),
    ).toThrow(/slug cannot be empty/);
  });

  it("rejects an empty title", () => {
    expect(() =>
      SubSite.from({ slug: "refactoring", title: "  ", catalogs: ["refactorings"] }),
    ).toThrow(/title cannot be empty/);
  });

  it("rejects an empty catalogs list", () => {
    expect(() => SubSite.from({ slug: "refactoring", title: "Refactoring", catalogs: [] })).toThrow(
      /catalogs cannot be empty/,
    );
  });

  it("href returns /<slug>", () => {
    const fowler = SubSite.from({
      slug: "refactoring",
      title: "Refactoring",
      catalogs: ["refactorings", "smells"],
    });

    expect(fowler.href()).toBe("/refactoring");
  });

  it("hrefForCatalog nests the catalog segment when the sub-site hosts multiple catalogs", () => {
    const fowler = SubSite.from({
      slug: "refactoring",
      title: "Refactoring",
      catalogs: ["refactorings", "smells"],
    });

    expect(fowler.hrefForCatalog("refactorings")).toBe("/refactoring/refactorings");
    expect(fowler.hrefForCatalog("smells")).toBe("/refactoring/smells");
  });

  it("hrefForCatalog omits the catalog segment when the sub-site hosts a single catalog", () => {
    const kerievsky = SubSite.from({
      slug: "refactoring-to-patterns",
      title: "Refactoring to Patterns",
      catalogs: ["refactorings"],
    });

    expect(kerievsky.hrefForCatalog("refactorings")).toBe("/refactoring-to-patterns");
  });

  it("hrefForEntry nests catalog and entry when the sub-site hosts multiple catalogs", () => {
    const fowler = SubSite.from({
      slug: "refactoring",
      title: "Refactoring",
      catalogs: ["refactorings", "smells"],
    });

    expect(fowler.hrefForEntry("refactorings", "extract-function")).toBe(
      "/refactoring/refactorings/extract-function",
    );
  });

  it("hrefForEntry omits the catalog segment when the sub-site hosts a single catalog", () => {
    const kerievsky = SubSite.from({
      slug: "refactoring-to-patterns",
      title: "Refactoring to Patterns",
      catalogs: ["refactorings"],
    });

    expect(kerievsky.hrefForEntry("refactorings", "compose-method")).toBe(
      "/refactoring-to-patterns/compose-method",
    );
  });

  it("hrefForCatalog throws when asked for a catalog the sub-site does not host", () => {
    const fowler = SubSite.from({
      slug: "refactoring",
      title: "Refactoring",
      catalogs: ["refactorings"],
    });

    expect(() => fowler.hrefForCatalog("smells")).toThrow(/does not contain catalog "smells"/);
  });

  it("equals compares sub-sites by slug", () => {
    const fowler1 = SubSite.from({
      slug: "refactoring",
      title: "Refactoring",
      catalogs: ["refactorings"],
    });
    const fowler2 = SubSite.from({
      slug: "refactoring",
      title: "Different Title",
      catalogs: ["smells"],
    });
    const kerievsky = SubSite.from({
      slug: "refactoring-to-patterns",
      title: "Refactoring to Patterns",
      catalogs: ["refactorings"],
    });

    expect(fowler1.equals(fowler2)).toBe(true);
    expect(fowler1.equals(kerievsky)).toBe(false);
  });
});
