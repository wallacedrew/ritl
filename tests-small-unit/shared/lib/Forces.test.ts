import { describe, expect, it } from "vitest";

import { Forces } from "@/shared/lib/Forces";

const validForces = {
  symptom: "S",
  goal: "G",
  pressure: "P",
  tradeoff: "T",
  relief: "R",
  trap: "X",
};

describe("Forces", () => {
  it("exposes all six force fields as readonly properties", () => {
    const forces = Forces.from(validForces);

    expect(forces.symptom).toBe("S");
    expect(forces.goal).toBe("G");
    expect(forces.pressure).toBe("P");
    expect(forces.tradeoff).toBe("T");
    expect(forces.relief).toBe("R");
    expect(forces.trap).toBe("X");
  });

  it("rejects an empty value in any force field", () => {
    for (const field of ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const) {
      expect(() => Forces.from({ ...validForces, [field]: "" })).toThrow(
        new RegExp(`${field}.*cannot be empty`, "i"),
      );
      expect(() => Forces.from({ ...validForces, [field]: "   " })).toThrow(
        new RegExp(`${field}.*cannot be empty`, "i"),
      );
    }
  });

  it("treats forces with identical fields as equal", () => {
    expect(Forces.from(validForces).equals(Forces.from(validForces))).toBe(true);
  });

  it("treats forces with any field differing as unequal", () => {
    expect(
      Forces.from(validForces).equals(Forces.from({ ...validForces, trap: "different" })),
    ).toBe(false);
  });
});
