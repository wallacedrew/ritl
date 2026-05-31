import { describe, expect, it } from "vitest";

import { chipColorForTone, dotBgForTone } from "@/shared/lib/catalogChipColor";

describe("chipColorForTone", () => {
  it("maps fowler-refactoring → success (green)", () => {
    expect(chipColorForTone("fowler-refactoring")).toBe("success");
  });

  it("maps smell → error (red)", () => {
    expect(chipColorForTone("smell")).toBe("error");
  });

  it("maps kerievsky-refactoring → warning (orange)", () => {
    expect(chipColorForTone("kerievsky-refactoring")).toBe("warning");
  });

  it("maps pattern → info (blue)", () => {
    expect(chipColorForTone("pattern")).toBe("info");
  });
});

describe("dotBgForTone", () => {
  it("appends '.main' to the chip color so the value plugs into sx.bgcolor", () => {
    expect(dotBgForTone("fowler-refactoring")).toBe("success.main");
    expect(dotBgForTone("smell")).toBe("error.main");
    expect(dotBgForTone("kerievsky-refactoring")).toBe("warning.main");
    expect(dotBgForTone("pattern")).toBe("info.main");
  });
});
