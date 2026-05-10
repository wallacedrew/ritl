import { describe, expect, it } from "vitest";

import { parseSmell } from "@/smells/lib/parseSmell";

const validRaw = {
  name: "Mysterious Name",
  symptom: "Names that don't reveal intent.",
  risk: "Re-comprehension cost on every read.",
  refactoring: "Rename Variable",
  goal: "Names read as the domain.",
  savings: "Faster onboarding and code review.",
  before: "function calc(d, t) { return d * t; }",
  after: "function distance(speed, time) { return speed * time; }",
};

describe("parseSmell", () => {
  it("returns a Smell when every required field is a string", () => {
    const smell = parseSmell(validRaw);

    expect(smell.name).toBe("Mysterious Name");
    expect(smell.refactoring).toBe("Rename Variable");
    expect(smell.symptom).toContain("don't reveal intent");
  });

  it("rejects null", () => {
    expect(() => parseSmell(null)).toThrow(/object/i);
  });

  it("rejects undefined", () => {
    expect(() => parseSmell(undefined)).toThrow(/object/i);
  });

  it("rejects a string primitive", () => {
    expect(() => parseSmell("not an object")).toThrow(/object/i);
  });

  it("rejects a number primitive", () => {
    expect(() => parseSmell(42)).toThrow(/object/i);
  });

  it("rejects an array", () => {
    expect(() => parseSmell([])).toThrow(/object/i);
  });

  it("rejects when a required string field is missing", () => {
    const incomplete = {
      symptom: "x",
      risk: "x",
      refactoring: "x",
      goal: "x",
      savings: "x",
      before: "x",
      after: "x",
    };

    expect(() => parseSmell(incomplete)).toThrow(/name.*string/i);
  });

  it("rejects when a required field is the wrong type", () => {
    const withBadRisk = { ...validRaw, risk: 99 };

    expect(() => parseSmell(withBadRisk)).toThrow(/risk.*string/i);
  });
});
