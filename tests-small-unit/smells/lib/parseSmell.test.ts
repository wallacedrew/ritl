import { describe, expect, it } from "vitest";

import { parseSmell } from "@/smells/lib/parseSmell";

const validRaw = {
  name: "Mysterious Name",
  symptom: "Names that don't reveal intent.",
  risk: "Re-comprehension cost on every read.",
  refactorings: ["Rename Variable"],
  goal: "Names read as the domain.",
  savings: "Faster onboarding and code review.",
  before: "function calc(d, t) { return d * t; }",
  after: "function distance(speed, time) { return speed * time; }",
};

describe("parseSmell", () => {
  it("returns a Smell with name and refactorings wrapped as CatalogEntryName instances", () => {
    const smell = parseSmell(validRaw);

    expect(smell.name.toString()).toBe("Mysterious Name");
    expect(smell.name.toCatalogHref()).toBe("/smells/mysterious-name");
    expect(smell.refactorings.map((r) => r.toString())).toEqual(["Rename Variable"]);
    expect(smell.refactorings[0]?.toCatalogHref()).toBe("/refactorings/rename-variable");
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
      refactorings: ["x"],
      goal: "x",
      savings: "x",
      before: "x",
      after: "x",
    };

    expect(() => parseSmell(incomplete)).toThrow(/name.*string/i);
  });

  it("rejects when a required string field is the wrong type", () => {
    const withBadRisk = { ...validRaw, risk: 99 };

    expect(() => parseSmell(withBadRisk)).toThrow(/risk.*string/i);
  });

  it("rejects when refactorings is missing", () => {
    const withoutRefactorings = { ...validRaw } as Record<string, unknown>;
    delete withoutRefactorings.refactorings;

    expect(() => parseSmell(withoutRefactorings)).toThrow(/refactorings.*array/i);
  });

  it("rejects when refactorings is not an array", () => {
    const withBadRefactorings = { ...validRaw, refactorings: "Rename Variable" };

    expect(() => parseSmell(withBadRefactorings)).toThrow(/refactorings.*array/i);
  });

  it("rejects when refactorings contains a non-string", () => {
    const withBadRefactorings = { ...validRaw, refactorings: ["Rename Variable", 42] };

    expect(() => parseSmell(withBadRefactorings)).toThrow(/refactorings.*string/i);
  });
});
