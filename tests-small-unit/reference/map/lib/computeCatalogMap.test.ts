import { describe, expect, it } from "vitest";

import type { CatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";
import { computeCatalogMap } from "@/reference/map/lib/computeCatalogMap";
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
    CatalogEntryName.refactoring("Split Loop"),
  ],
});

const isolatedSmell = entry({
  catalog: "smells",
  name: CatalogEntryName.smell("Isolated Smell"),
  nemeses: [CatalogEntryName.refactoring("Extract Function")],
});

const extractFunction = entry({
  catalog: "refactorings",
  name: CatalogEntryName.refactoring("Extract Function"),
  nemeses: [CatalogEntryName.smell("Long Function"), CatalogEntryName.smell("Isolated Smell")],
});

const splitLoop = entry({
  catalog: "refactorings",
  name: CatalogEntryName.refactoring("Split Loop"),
  nemeses: [CatalogEntryName.smell("Long Function")],
});

const replaceTempWithQuery = entry({
  catalog: "refactorings",
  name: CatalogEntryName.refactoring("Replace Temp with Query"),
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
  // no destinationPattern → should appear in kerievskyWithoutDestination
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
  refactorings: [extractFunction, splitLoop, replaceTempWithQuery],
  smells: [longFunction, isolatedSmell],
  patterns: [composeMethod, encapsulateClassesWithFactory, factoryMethod],
};

describe("computeCatalogMap", () => {
  it("emits one cross-book bridge per Kerievsky entry that has a destination", () => {
    const map = computeCatalogMap(snapshot);

    expect(map.crossBookBridges).toHaveLength(1);
    const [bridge] = map.crossBookBridges;
    expect(bridge?.source.label).toBe("Encapsulate Classes With Factory");
    expect(bridge?.destination.label).toBe("Factory Method");
    expect(bridge?.source.href).toBe("/refactoring-to-patterns/encapsulate-classes-with-factory");
    expect(bridge?.destination.href).toBe("/design-patterns/factory-method");
  });

  it("lists Kerievsky entries that have no destination set", () => {
    const map = computeCatalogMap(snapshot);

    expect(map.kerievskyWithoutDestination.map((chip) => chip.label)).toEqual(["Compose Method"]);
  });

  it("ranks most-connected entries by total inbound + outbound count, descending", () => {
    const map = computeCatalogMap(snapshot);

    const ordered = map.mostConnectedEntries.map((row) => row.chip.label);
    // Long Function: 3 outbound + 3 inbound (Extract, Split, Replace) + 1 from Compose Method = 7
    // Extract Function: 2 outbound + 2 inbound (Long Function, Compose Method) = 4
    expect(ordered[0]).toBe("Long Function");
  });

  it("attaches outbound + inbound counts to each ranked entry", () => {
    const map = computeCatalogMap(snapshot);

    const longFunctionRow = map.mostConnectedEntries.find(
      (row) => row.chip.label === "Long Function",
    );
    expect(longFunctionRow).toBeDefined();
    expect(longFunctionRow?.outboundCount).toBe(3);
    expect(longFunctionRow?.inboundCount).toBeGreaterThanOrEqual(3);
    expect(longFunctionRow?.totalCount).toBe(
      (longFunctionRow?.outboundCount ?? 0) + (longFunctionRow?.inboundCount ?? 0),
    );
  });

  it("ranks sparsest entries by total connection count, ascending", () => {
    const map = computeCatalogMap(snapshot);

    const ordered = map.sparsestEntries.map((row) => row.chip.label);
    // Factory Method (1 inbound only) and Encapsulate Classes With Factory (1 outbound only)
    // tie for sparsest in this fixture; both must appear and Long Function (totalCount ≥ 7) must not.
    expect(ordered).toContain("Factory Method");
    expect(ordered).toContain("Encapsulate Classes With Factory");
    expect(ordered).not.toContain("Long Function");
  });

  it("caps the most-connected and sparsest lists at a small N", () => {
    const map = computeCatalogMap(snapshot);

    expect(map.mostConnectedEntries.length).toBeLessThanOrEqual(10);
    expect(map.sparsestEntries.length).toBeLessThanOrEqual(5);
  });
});
