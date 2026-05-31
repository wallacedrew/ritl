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
      "/refactoring/canon/extract-function",
      "/refactoring/canon/replace-temp-with-query",
    ]);
    expect(entry.forces.human.symptom).toBe("S");
    expect(entry.forces.agent.trap).toBe("X");
  });

  it("parses a refactoring with nemeses wrapped as smell names", () => {
    const entry = parseCatalogEntry(validRefactoring);

    expect(entry.catalog).toBe("refactorings");
    expect(entry.name.toString()).toBe("Extract Function");
    expect(entry.nemeses.map((n) => n.toCatalogHref())).toEqual([
      "/refactoring/smells/long-function",
      "/refactoring/smells/duplicated-code",
    ]);
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
      catalog: "design-patterns",
      book: "kerievsky",
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

    expect(entry.catalog).toBe("design-patterns");
    expect(entry.name.toString()).toBe("Compose Method");
    expect(entry.book).toBe("kerievsky");
    expect(entry.nemeses.map((n) => n.toCatalogHref())).toEqual([
      "/refactoring/canon/extract-function",
      "/refactoring/smells/long-function",
    ]);
  });

  it("rejects a pattern nemesis that is a bare string instead of {catalog, name}", () => {
    expect(() =>
      parseCatalogEntry({
        catalog: "design-patterns",
        book: "kerievsky",
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
        catalog: "design-patterns",
        book: "kerievsky",
        name: "Compose Method",
        nemeses: [{ catalog: "design-patterns", name: "Strategy" }],
        before: "x",
        after: "y",
        forces: { human: validForcesRecord, agent: validForcesRecord },
      }),
    ).toThrow(/nemesis "catalog".*refactorings.*smells/i);
  });

  it("parses a refactoring nemesis declared in object shape targeting a smell", () => {
    const entry = parseCatalogEntry({
      ...validRefactoring,
      nemeses: [{ catalog: "smells", name: "Long Function" }],
    });

    expect(entry.nemeses.map((n) => n.toCatalogHref())).toEqual([
      "/refactoring/smells/long-function",
    ]);
  });

  it("parses a refactoring nemesis declared in object shape targeting another refactoring", () => {
    const entry = parseCatalogEntry({
      ...validRefactoring,
      nemeses: [{ catalog: "refactorings", name: "Replace Temp with Query" }],
    });

    expect(entry.nemeses.map((n) => n.toCatalogHref())).toEqual([
      "/refactoring/canon/replace-temp-with-query",
    ]);
  });

  it("parses a smell nemesis declared in object shape targeting another smell", () => {
    const entry = parseCatalogEntry({
      ...validSmell,
      nemeses: [{ catalog: "smells", name: "Mysterious Name" }],
    });

    expect(entry.nemeses.map((n) => n.toCatalogHref())).toEqual([
      "/refactoring/smells/mysterious-name",
    ]);
  });

  it("rejects a refactoring nemesis object whose catalog is patterns", () => {
    expect(() =>
      parseCatalogEntry({
        ...validRefactoring,
        nemeses: [{ catalog: "design-patterns", name: "Strategy" }],
      }),
    ).toThrow(/nemesis "catalog".*refactorings.*smells/i);
  });

  it("rejects a refactoring nemesis that is neither a string nor a {catalog, name} object", () => {
    expect(() =>
      parseCatalogEntry({
        ...validRefactoring,
        nemeses: [42],
      }),
    ).toThrow(/must be a string or an object/i);
  });

  it("rejects a pattern entry that does not declare a book", () => {
    expect(() =>
      parseCatalogEntry({
        catalog: "design-patterns",
        name: "Strategy",
        nemeses: [],
        before: "x",
        after: "y",
        forces: { human: validForcesRecord, agent: validForcesRecord },
      }),
    ).toThrow(/pattern entries must declare a "book"/i);
  });

  it("rejects a pattern entry with an unknown book value", () => {
    expect(() =>
      parseCatalogEntry({
        catalog: "design-patterns",
        book: "fowler",
        name: "Strategy",
        nemeses: [],
        before: "x",
        after: "y",
        forces: { human: validForcesRecord, agent: validForcesRecord },
      }),
    ).toThrow(/field "book" on a pattern must be one of/i);
  });

  it("rejects a smell entry that carries a book field", () => {
    expect(() => parseCatalogEntry({ ...validSmell, book: "kerievsky" })).toThrow(
      /"book" is not allowed on smell entries/i,
    );
  });

  it('parses a refactoring with book="fowler" explicitly declared', () => {
    const entry = parseCatalogEntry({ ...validRefactoring, book: "fowler" });

    expect(entry.book).toBe("fowler");
  });

  it('parses a refactoring with book="kerievsky"', () => {
    const entry = parseCatalogEntry({ ...validRefactoring, book: "kerievsky" });

    expect(entry.book).toBe("kerievsky");
  });

  it('defaults a refactoring\'s book to "fowler" when the field is omitted', () => {
    const entry = parseCatalogEntry(validRefactoring);

    expect(entry.book).toBe("fowler");
  });

  it('rejects a refactoring with book="gof"', () => {
    expect(() => parseCatalogEntry({ ...validRefactoring, book: "gof" })).toThrow(
      /field "book" on a refactoring must be one of/i,
    );
  });

  it("parses gof as a valid pattern book", () => {
    const entry = parseCatalogEntry({
      catalog: "design-patterns",
      book: "gof",
      name: "Strategy",
      nemeses: [],
      before: "switch on type",
      after: "polymorphic dispatch via Strategy",
      forces: { human: validForcesRecord, agent: validForcesRecord },
    });

    expect(entry.book).toBe("gof");
  });

  it("parses a destinationPattern pointing across books from kerievsky to gof", () => {
    const entry = parseCatalogEntry({
      catalog: "design-patterns",
      book: "kerievsky",
      name: "Replace Conditional Logic with Strategy",
      nemeses: [{ catalog: "refactorings", name: "Replace Conditional with Polymorphism" }],
      before: "x",
      after: "y",
      forces: { human: validForcesRecord, agent: validForcesRecord },
      destinationPattern: { book: "gof", name: "Strategy" },
    });

    expect(entry.destinationPattern?.toString()).toBe("Strategy");
    expect(entry.destinationPattern?.toCatalogHref()).toBe("/design-patterns/strategy");
  });

  it("rejects a destinationPattern on a non-pattern entry", () => {
    expect(() =>
      parseCatalogEntry({
        ...validSmell,
        destinationPattern: { book: "gof", name: "Strategy" },
      }),
    ).toThrow(/destinationPattern.*only allowed on patterns or refactorings/i);
  });

  it("rejects a destinationPattern whose book matches the entry's own book", () => {
    expect(() =>
      parseCatalogEntry({
        catalog: "design-patterns",
        book: "kerievsky",
        name: "Replace Conditional Logic with Strategy",
        nemeses: [],
        before: "x",
        after: "y",
        forces: { human: validForcesRecord, agent: validForcesRecord },
        destinationPattern: { book: "kerievsky", name: "Compose Method" },
      }),
    ).toThrow(/must point at a pattern in a different book/i);
  });

  it("rejects a destinationPattern with an unknown book", () => {
    expect(() =>
      parseCatalogEntry({
        catalog: "design-patterns",
        book: "kerievsky",
        name: "Replace Conditional Logic with Strategy",
        nemeses: [],
        before: "x",
        after: "y",
        forces: { human: validForcesRecord, agent: validForcesRecord },
        destinationPattern: { book: "fowler", name: "Strategy" },
      }),
    ).toThrow(/"destinationPattern\.book" must be one of/i);
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

  it("parses an optional exampleSource attribution when present", () => {
    const entry = parseCatalogEntry({
      ...validRefactoring,
      exampleSource: "Adapted from Fowler, p.106",
    });

    expect(entry.exampleSource).toBe("Adapted from Fowler, p.106");
  });

  it("leaves exampleSource undefined when the field is absent", () => {
    const entry = parseCatalogEntry(validRefactoring);

    expect(entry.exampleSource).toBeUndefined();
  });

  it("rejects exampleSource when it is not a string", () => {
    expect(() => parseCatalogEntry({ ...validRefactoring, exampleSource: 42 })).toThrow(
      /exampleSource.*string/i,
    );
  });
});
