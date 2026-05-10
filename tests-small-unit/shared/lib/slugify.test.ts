import { describe, expect, it } from "vitest";

import { slugify } from "@/shared/lib/slugify";

describe("slugify", () => {
  it("converts a Fowler smell name to a URL-safe slug", () => {
    expect(slugify("Mysterious Name")).toBe("mysterious-name");
  });

  it("handles multi-word names", () => {
    expect(slugify("Long Parameter List")).toBe("long-parameter-list");
  });

  it("strips punctuation", () => {
    expect(slugify("Don't worry")).toBe("dont-worry");
  });

  it("collapses multiple spaces", () => {
    expect(slugify("Long  Function")).toBe("long-function");
  });

  it("trims leading/trailing whitespace", () => {
    expect(slugify("  Duplicated Code  ")).toBe("duplicated-code");
  });

  it("handles long multi-word names", () => {
    expect(slugify("Alternative Classes with Different Interfaces")).toBe(
      "alternative-classes-with-different-interfaces",
    );
  });
});
