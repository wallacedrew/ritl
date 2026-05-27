import { describe, expect, it } from "vitest";

import { parseCatalogEntry } from "@/shared/lib/parseCatalogEntry";

const validForcesRecord = {
  symptom: "S",
  goal: "G",
  pressure: "P",
  tradeoff: "T",
  relief: "R",
  trap: "X",
};

const validSmell = {
  catalog: "smells",
  name: "Long Function",
  nemeses: ["Extract Function", "Replace Temp with Query"],
  before: "function f() { /* big body */ }",
  after: "function f() { /* small body */ }",
  forces: {
    human: validForcesRecord,
    agent: validForcesRecord,
  },
};

const validRefactoring = {
  catalog: "refactorings",
  name: "Extract Function",
  nemeses: ["Long Function", "Duplicated Code"],
  before: "code A",
  after: "code B",
  safetyNet: "unit test",
  forces: {
    human: validForcesRecord,
    agent: validForcesRecord,
  },
};

describe("parseCatalogEntry", () => {
  it("parses a smell with nemeses wrapped as refactoring names", () => {
    const entry = parseCatalogEntry(validSmell);

    expect(entry.catalog).toBe("smells");
    expect(entry.name.toString()).toBe("Long Function");
    expect(entry.nemeses.map((n) => n.toCatalogHref())).toEqual([
      "/refactoring/refactorings/extract-function",
      "/refactoring/refactorings/replace-temp-with-query",
    ]);
    expect(entry.forces.human.symptom).toBe("S");
    expect(entry.forces.agent.trap).toBe("X");
    expect(entry.safetyNet).toBeUndefined();
  });

  it("parses a refactoring with nemeses wrapped as smell names + safetyNet", () => {
    const entry = parseCatalogEntry(validRefactoring);

    expect(entry.catalog).toBe("refactorings");
    expect(entry.name.toString()).toBe("Extract Function");
    expect(entry.nemeses.map((n) => n.toCatalogHref())).toEqual([
      "/refactoring/smells/long-function",
      "/refactoring/smells/duplicated-code",
    ]);
    expect(entry.safetyNet?.toString()).toBe("unit test");
  });

  it("rejects null, undefined, primitives, and arrays", () => {
    expect(() => parseCatalogEntry(null)).toThrow(/object/i);
    expect(() => parseCatalogEntry(undefined)).toThrow(/object/i);
    expect(() => parseCatalogEntry("nope")).toThrow(/object/i);
    expect(() => parseCatalogEntry([])).toThrow(/object/i);
  });

  it("rejects an unknown catalog discriminator", () => {
    expect(() => parseCatalogEntry({ ...validSmell, catalog: "rituals" })).toThrow(
      /catalog.*one of/i,
    );
  });

  it("parses a pattern with object-shape nemeses targeting refactorings or smells", () => {
    const validPattern = {
      catalog: "patterns",
      name: "Compose Method",
      nemeses: [
        { catalog: "refactorings", name: "Extract Function" },
        { catalog: "smells", name: "Long Function" },
      ],
      before: "long method",
      after: "small named steps",
      forces: { human: validForcesRecord, agent: validForcesRecord },
    };

    const entry = parseCatalogEntry(validPattern);

    expect(entry.catalog).toBe("patterns");
    expect(entry.name.toString()).toBe("Compose Method");
    expect(entry.nemeses.map((n) => n.toCatalogHref())).toEqual([
      "/refactoring/refactorings/extract-function",
      "/refactoring/smells/long-function",
    ]);
  });

  it("rejects a pattern nemesis that is a bare string instead of {catalog, name}", () => {
    expect(() =>
      parseCatalogEntry({
        catalog: "patterns",
        name: "Compose Method",
        nemeses: ["Extract Function"],
        before: "x",
        after: "y",
        forces: { human: validForcesRecord, agent: validForcesRecord },
      }),
    ).toThrow(/pattern nemeses must be objects/i);
  });

  it("rejects a pattern nemesis whose catalog field is not refactorings or smells", () => {
    expect(() =>
      parseCatalogEntry({
        catalog: "patterns",
        name: "Compose Method",
        nemeses: [{ catalog: "patterns", name: "Strategy" }],
        before: "x",
        after: "y",
        forces: { human: validForcesRecord, agent: validForcesRecord },
      }),
    ).toThrow(/pattern nemesis "catalog".*refactorings.*smells/i);
  });

  it("rejects when nemeses is missing or not an array", () => {
    const withoutNemeses = { ...validSmell } as Record<string, unknown>;
    delete withoutNemeses.nemeses;
    expect(() => parseCatalogEntry(withoutNemeses)).toThrow(/nemeses.*array/i);

    expect(() => parseCatalogEntry({ ...validSmell, nemeses: "not an array" })).toThrow(
      /nemeses.*array/i,
    );
  });

  it("rejects when the forces container is missing", () => {
    const withoutForces = { ...validSmell } as Record<string, unknown>;
    delete withoutForces.forces;
    expect(() => parseCatalogEntry(withoutForces)).toThrow(/forces.*object/i);
  });

  it("rejects when forces.agent is missing", () => {
    expect(() =>
      parseCatalogEntry({
        ...validSmell,
        forces: { human: validForcesRecord },
      }),
    ).toThrow(/forces\.agent.*object/i);
  });

  it("rejects when a forces sub-field is the wrong type", () => {
    const badAgent = { ...validForcesRecord, trap: 42 };
    expect(() =>
      parseCatalogEntry({ ...validSmell, forces: { human: validForcesRecord, agent: badAgent } }),
    ).toThrow(/forces\.agent\.trap.*string/i);
  });

  it("rejects an empty forces sub-field via the Forces value object's own validation", () => {
    const empty = { ...validForcesRecord, relief: "" };
    expect(() =>
      parseCatalogEntry({ ...validSmell, forces: { human: empty, agent: validForcesRecord } }),
    ).toThrow(/relief.*cannot be empty/i);
  });

  it("rejects an unknown safetyNet value", () => {
    expect(() => parseCatalogEntry({ ...validRefactoring, safetyNet: "integration test" })).toThrow(
      /unknown safety net/i,
    );
  });
});
