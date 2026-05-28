import { describe, expect, it } from "vitest";

import { chipColorForTone, dotBgForTone } from "@/shared/lib/catalogChipColor";

describe("chipColorForTone", () => {
  it("maps refactoring → success (green)", () => {
    expect(chipColorForTone("refactoring")).toBe("success");
  });

  it("maps smell → error (red)", () => {
    expect(chipColorForTone("smell")).toBe("error");
  });

  it("maps kerievsky-pattern → warning (orange)", () => {
    expect(chipColorForTone("kerievsky-pattern")).toBe("warning");
  });

  it("maps gof-pattern → info (blue)", () => {
    expect(chipColorForTone("gof-pattern")).toBe("info");
  });
});

describe("dotBgForTone", () => {
  it("appends '.main' to the chip color so the value plugs into sx.bgcolor", () => {
    expect(dotBgForTone("refactoring")).toBe("success.main");
    expect(dotBgForTone("smell")).toBe("error.main");
    expect(dotBgForTone("kerievsky-pattern")).toBe("warning.main");
    expect(dotBgForTone("gof-pattern")).toBe("info.main");
  });
});
