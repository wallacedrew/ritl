import { describe, expect, it } from "vitest";

import { parseRefactoring } from "@/refactorings/lib/parseRefactoring";

const validRaw = {
  name: "Extract Function",
  solves: ["Long Function", "Duplicated Code"],
  tradeoff: "Maze of one-line functions if over-eager.",
  goal: "Each function reads as a single named domain step.",
  savings: "Bugs concentrate inside named subroutines.",
  before: "function ship(o) { /* big body */ }",
  after: "function ship(o) { validate(o); notify(o); }",
};

describe("parseRefactoring", () => {
  it("returns a Refactoring with name and solves wrapped as CatalogEntryName instances", () => {
    const refactoring = parseRefactoring(validRaw);

    expect(refactoring.name.toString()).toBe("Extract Function");
    expect(refactoring.name.toCatalogHref()).toBe("/refactorings/extract-function");
    expect(refactoring.solves.map((s) => s.toString())).toEqual([
      "Long Function",
      "Duplicated Code",
    ]);
    expect(refactoring.solves[0]?.toCatalogHref()).toBe("/smells/long-function");
    expect(refactoring.goal).toContain("single named");
  });

  it("rejects null", () => {
    expect(() => parseRefactoring(null)).toThrow(/object/i);
  });

  it("rejects undefined", () => {
    expect(() => parseRefactoring(undefined)).toThrow(/object/i);
  });

  it("rejects a primitive", () => {
    expect(() => parseRefactoring("not an object")).toThrow(/object/i);
  });

  it("rejects an array", () => {
    expect(() => parseRefactoring([])).toThrow(/object/i);
  });

  it("rejects when a required string field is missing", () => {
    const incomplete = { ...validRaw } as Record<string, unknown>;
    delete incomplete.name;

    expect(() => parseRefactoring(incomplete)).toThrow(/name.*string/i);
  });

  it("rejects when a string field is the wrong type", () => {
    const withBadGoal = { ...validRaw, goal: 99 };

    expect(() => parseRefactoring(withBadGoal)).toThrow(/goal.*string/i);
  });

  it("rejects when solves is missing", () => {
    const withoutSolves = { ...validRaw } as Record<string, unknown>;
    delete withoutSolves.solves;

    expect(() => parseRefactoring(withoutSolves)).toThrow(/solves.*array/i);
  });

  it("rejects when solves is not an array", () => {
    const withBadSolves = { ...validRaw, solves: "Long Function" };

    expect(() => parseRefactoring(withBadSolves)).toThrow(/solves.*array/i);
  });

  it("rejects when solves contains a non-string", () => {
    const withBadSolves = { ...validRaw, solves: ["Long Function", 42] };

    expect(() => parseRefactoring(withBadSolves)).toThrow(/solves.*string/i);
  });

  it("returns no safetyNet when the field is absent", () => {
    const refactoring = parseRefactoring(validRaw);

    expect(refactoring.safetyNet).toBeUndefined();
  });

  it("wraps a legal safetyNet value as a SafetyNet value object", () => {
    const refactoring = parseRefactoring({ ...validRaw, safetyNet: "types/compiler" });

    expect(refactoring.safetyNet?.toString()).toBe("types/compiler");
  });

  it("rejects an unknown safetyNet value", () => {
    expect(() => parseRefactoring({ ...validRaw, safetyNet: "integration test" })).toThrow(
      /unknown safety net/i,
    );
  });

  it("rejects a non-string safetyNet value", () => {
    expect(() => parseRefactoring({ ...validRaw, safetyNet: 99 })).toThrow(/safetyNet.*string/i);
  });

  it("rejects when tradeoff is missing", () => {
    const incomplete = { ...validRaw } as Record<string, unknown>;
    delete incomplete.tradeoff;

    expect(() => parseRefactoring(incomplete)).toThrow(/tradeoff.*string/i);
  });

  it("rejects when tradeoff is the wrong type", () => {
    const withBadTradeoff = { ...validRaw, tradeoff: 42 };

    expect(() => parseRefactoring(withBadTradeoff)).toThrow(/tradeoff.*string/i);
  });

  it("returns no failureMode when the field is absent", () => {
    const refactoring = parseRefactoring(validRaw);

    expect(refactoring.failureMode).toBeUndefined();
  });

  it("returns the failureMode string when the field is present", () => {
    const refactoring = parseRefactoring({
      ...validRaw,
      failureMode: "Agent loses cross-function invariants when chasing extracted helpers.",
    });

    expect(refactoring.failureMode).toBe(
      "Agent loses cross-function invariants when chasing extracted helpers.",
    );
  });

  it("rejects a non-string failureMode value", () => {
    expect(() => parseRefactoring({ ...validRaw, failureMode: 42 })).toThrow(
      /failureMode.*string/i,
    );
  });
});
