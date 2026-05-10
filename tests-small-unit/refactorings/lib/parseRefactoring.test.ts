import { describe, expect, it } from "vitest";

import { parseRefactoring } from "@/refactorings/lib/parseRefactoring";

const validRaw = {
  name: "Extract Function",
  solves: ["Long Function", "Duplicated Code"],
  risk: "Maze of one-line functions if over-eager.",
  goal: "Each function reads as a single named domain step.",
  savings: "Bugs concentrate inside named subroutines.",
  before: "function ship(o) { /* big body */ }",
  after: "function ship(o) { validate(o); notify(o); }",
};

describe("parseRefactoring", () => {
  it("returns a Refactoring when every required field is the right shape", () => {
    const refactoring = parseRefactoring(validRaw);

    expect(refactoring.name).toBe("Extract Function");
    expect(refactoring.solves).toEqual(["Long Function", "Duplicated Code"]);
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
});
