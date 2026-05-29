import { describe, expect, it } from "vitest";

import { collectCrossReferences, type CatalogSnapshot } from "@/shared/lib/collectCrossReferences";
import { CatalogEntry, type CatalogEntryProps } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";

const fillerForces = Forces.from({
  symptom: "s",
  goal: "g",
  pressure: "p",
  tradeoff: "t",
  relief: "r",
  trap: "x",
});

function entry(
  overrides: Partial<CatalogEntryProps> & Pick<CatalogEntryProps, "catalog" | "name">,
): CatalogEntry {
  return CatalogEntry.from({
    before: "before",
    after: "after",
    forces: { human: fillerForces, agent: fillerForces },
    nemeses: [],
    ...overrides,
  });
}

const longFunction = entry({
  catalog: "smells",
  name: CatalogEntryName.smell("Long Function"),
  nemeses: [
    CatalogEntryName.refactoring("Extract Function"),
    CatalogEntryName.refactoring("Replace Temp with Query"),
  ],
});

const extractFunction = entry({
  catalog: "refactorings",
  name: CatalogEntryName.refactoring("Extract Function"),
  nemeses: [CatalogEntryName.smell("Long Function")],
});

const composeMethod = entry({
  catalog: "patterns",
  book: "kerievsky",
  name: CatalogEntryName.pattern("Compose Method", "kerievsky"),
  nemeses: [
    CatalogEntryName.smell("Long Function"),
    CatalogEntryName.refactoring("Extract Function"),
  ],
});

const encapsulateClassesWithFactory = entry({
  catalog: "patterns",
  book: "kerievsky",
  name: CatalogEntryName.pattern("Encapsulate Classes With Factory", "kerievsky"),
  destinationPattern: CatalogEntryName.pattern("Factory Method", "gof"),
});

const factoryMethod = entry({
  catalog: "patterns",
  book: "gof",
  name: CatalogEntryName.pattern("Factory Method", "gof"),
});

const snapshot: CatalogSnapshot = {
  refactorings: [extractFunction],
  smells: [longFunction],
  patterns: [composeMethod, encapsulateClassesWithFactory, factoryMethod],
};

describe("collectCrossReferences", () => {
  it("returns 'Apply refactorings' and 'Referenced by patterns' for a smell", () => {
    const crossReferences = collectCrossReferences(longFunction, snapshot);

    const labels = crossReferences.groups.map((group) => group.label);
    expect(labels).toEqual(["Apply refactorings", "Referenced by patterns"]);

    const applyRefactorings = crossReferences.groups[0];
    expect(applyRefactorings?.chips.map((chip) => chip.label)).toEqual([
      "Extract Function",
      "Replace Temp with Query",
    ]);

    const referencedByPatterns = crossReferences.groups[1];
    expect(referencedByPatterns?.chips.map((chip) => chip.label)).toEqual(["Compose Method"]);
  });

  it("returns 'Removes smells' and 'Referenced by patterns' for a refactoring", () => {
    const crossReferences = collectCrossReferences(extractFunction, snapshot);

    const labels = crossReferences.groups.map((group) => group.label);
    expect(labels).toEqual(["Removes smells", "Referenced by patterns"]);

    const removesSmells = crossReferences.groups[0];
    expect(removesSmells?.chips.map((chip) => chip.label)).toEqual(["Long Function"]);

    const referencedByPatterns = crossReferences.groups[1];
    expect(referencedByPatterns?.chips.map((chip) => chip.label)).toEqual(["Compose Method"]);
  });

  it("returns 'Triggered by' and 'Destination' for a Kerievsky pattern with a destination", () => {
    const crossReferences = collectCrossReferences(encapsulateClassesWithFactory, snapshot);

    const labels = crossReferences.groups.map((group) => group.label);
    expect(labels).toEqual(["Destination"]);

    const destination = crossReferences.groups[0];
    expect(destination?.chips.map((chip) => chip.label)).toEqual(["Factory Method"]);
  });

  it("returns only 'Triggered by' for a Kerievsky pattern with no destination", () => {
    const crossReferences = collectCrossReferences(composeMethod, snapshot);

    const labels = crossReferences.groups.map((group) => group.label);
    expect(labels).toEqual(["Triggered by"]);

    const triggeredBy = crossReferences.groups[0];
    expect(triggeredBy?.chips.map((chip) => chip.label)).toEqual([
      "Long Function",
      "Extract Function",
    ]);
  });

  it("returns 'Reached from' for a GoF pattern that Kerievsky journeys point at", () => {
    const crossReferences = collectCrossReferences(factoryMethod, snapshot);

    const labels = crossReferences.groups.map((group) => group.label);
    expect(labels).toEqual(["Reached from"]);

    const reachedFrom = crossReferences.groups[0];
    expect(reachedFrom?.chips.map((chip) => chip.label)).toEqual([
      "Encapsulate Classes With Factory",
    ]);
  });

  it("returns an empty CrossReferences when the entry has no connections in the snapshot", () => {
    const isolatedSmell = entry({
      catalog: "smells",
      name: CatalogEntryName.smell("Lone Smell"),
    });

    const result = collectCrossReferences(isolatedSmell, snapshot);
    expect(result.groups).toEqual([]);
  });
});
