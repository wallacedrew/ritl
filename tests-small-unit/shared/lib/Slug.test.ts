import { describe, expect, it } from "vitest";

import { Slug } from "@/shared/lib/Slug";

describe("Slug.from", () => {
  it("converts a Fowler smell name to a URL-safe slug", () => {
    expect(Slug.from("Mysterious Name").toString()).toBe("mysterious-name");
  });

  it("handles multi-word names", () => {
    expect(Slug.from("Long Parameter List").toString()).toBe("long-parameter-list");
  });

  it("strips punctuation", () => {
    expect(Slug.from("Don't worry").toString()).toBe("dont-worry");
  });

  it("collapses multiple spaces", () => {
    expect(Slug.from("Long  Function").toString()).toBe("long-function");
  });

  it("trims leading and trailing whitespace", () => {
    expect(Slug.from("  Duplicated Code  ").toString()).toBe("duplicated-code");
  });

  it("handles long multi-word names", () => {
    expect(Slug.from("Alternative Classes with Different Interfaces").toString()).toBe(
      "alternative-classes-with-different-interfaces",
    );
  });
});

describe("Slug.fromUrlPart", () => {
  it("accepts a well-formed kebab-case slug", () => {
    expect(Slug.fromUrlPart("extract-function").toString()).toBe("extract-function");
  });

  it("accepts a single-word slug", () => {
    expect(Slug.fromUrlPart("comments").toString()).toBe("comments");
  });

  it("throws on uppercase letters", () => {
    expect(() => Slug.fromUrlPart("Extract-Function")).toThrow(/not a valid slug/);
  });

  it("throws on leading dash", () => {
    expect(() => Slug.fromUrlPart("-extract-function")).toThrow(/not a valid slug/);
  });

  it("throws on trailing dash", () => {
    expect(() => Slug.fromUrlPart("extract-function-")).toThrow(/not a valid slug/);
  });

  it("throws on consecutive dashes", () => {
    expect(() => Slug.fromUrlPart("extract--function")).toThrow(/not a valid slug/);
  });

  it("throws on empty input", () => {
    expect(() => Slug.fromUrlPart("")).toThrow(/not a valid slug/);
  });

  it("throws on whitespace", () => {
    expect(() => Slug.fromUrlPart("extract function")).toThrow(/not a valid slug/);
  });
});

describe("Slug.equals", () => {
  it("returns true for slugs with the same value", () => {
    expect(Slug.from("Extract Function").equals(Slug.from("Extract Function"))).toBe(true);
  });

  it("returns true regardless of which factory was used", () => {
    expect(Slug.from("Extract Function").equals(Slug.fromUrlPart("extract-function"))).toBe(true);
  });

  it("returns false for slugs with different values", () => {
    expect(Slug.from("Extract Function").equals(Slug.from("Inline Function"))).toBe(false);
  });
});

describe("Slug.toCatalogHref", () => {
  const slug = Slug.from("Extract Function");

  it("builds a refactorings catalog href", () => {
    expect(slug.toCatalogHref("refactorings")).toBe("/refactoring/canon/extract-function");
  });

  it("builds a smells catalog href", () => {
    expect(Slug.from("Mysterious Name").toCatalogHref("smells")).toBe(
      "/refactoring/smells/mysterious-name",
    );
  });

  it("builds a kerievsky refactoring href under /refactoring-to-patterns", () => {
    expect(Slug.from("Compose Method").toCatalogHref("refactorings", "kerievsky")).toBe(
      "/refactoring-to-patterns/compose-method",
    );
  });

  it("builds a fowler refactoring href under /refactoring/canon", () => {
    expect(Slug.from("Extract Function").toCatalogHref("refactorings", "fowler")).toBe(
      "/refactoring/canon/extract-function",
    );
  });

  it("builds a gof pattern href under /design-patterns", () => {
    expect(Slug.from("Strategy").toCatalogHref("design-patterns", "gof")).toBe(
      "/design-patterns/strategy",
    );
  });

  it("rejects a patterns href when book is not supplied", () => {
    expect(() => Slug.from("Strategy").toCatalogHref("design-patterns")).toThrow(
      /"book" is required when kind is "design-patterns"/i,
    );
  });
});

describe("Slug.toSnippetHref", () => {
  it("builds a refactorings snippet href", () => {
    expect(Slug.from("Extract Function").toSnippetHref("refactorings")).toBe(
      "/snippets/refactorings/extract-function.md",
    );
  });

  it("builds a smells snippet href", () => {
    expect(Slug.from("Mysterious Name").toSnippetHref("smells")).toBe(
      "/snippets/smells/mysterious-name.md",
    );
  });
});
