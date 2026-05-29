import { describe, expect, it } from "vitest";

import {
  buildCatalogGraph,
  computeCrossReferencesForHref,
  type CatalogGraph,
} from "@/shared/lib/CatalogGraph";
import { CatalogEntry, type CatalogEntryProps } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import type { CatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";
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
  refactorings: [extractFunction, replaceTempWithQuery],
  smells: [longFunction],
  patterns: [composeMethod, encapsulateClassesWithFactory, factoryMethod],
};

describe("buildCatalogGraph", () => {
  it("indexes every entry by its catalog href", () => {
    const graph = buildCatalogGraph(snapshot);

    expect(graph.nodes.get("/refactoring/smells/long-function")?.name).toBe("Long Function");
    expect(graph.nodes.get("/refactoring/canon/extract-function")?.name).toBe("Extract Function");
    expect(graph.nodes.get("/design-patterns/factory-method")?.name).toBe("Factory Method");
  });

  it("captures each entry's outbound nemesis hrefs and destination href", () => {
    const graph = buildCatalogGraph(snapshot);

    const longFunctionNode = graph.nodes.get("/refactoring/smells/long-function");
    expect(longFunctionNode?.nemesisHrefs).toEqual([
      "/refactoring/canon/extract-function",
      "/refactoring/canon/replace-temp-with-query",
    ]);

    const encapsulateNode = graph.nodes.get(
      "/refactoring-to-patterns/encapsulate-classes-with-factory",
    );
    expect(encapsulateNode?.destinationHref).toBe("/design-patterns/factory-method");
  });

  it("builds the inverse-lookup maps from nemeses and destinationPattern", () => {
    const graph = buildCatalogGraph(snapshot);

    const inboundToExtractFunction = graph.inboundByHref.get("/refactoring/canon/extract-function");
    expect(inboundToExtractFunction).toContain("/refactoring/smells/long-function");
    expect(inboundToExtractFunction).toContain("/refactoring-to-patterns/compose-method");

    const factoryMethodSources = graph.destinationSourcesByHref.get(
      "/design-patterns/factory-method",
    );
    expect(factoryMethodSources).toEqual([
      "/refactoring-to-patterns/encapsulate-classes-with-factory",
    ]);
  });
});

describe("computeCrossReferencesForHref", () => {
  const graph: CatalogGraph = buildCatalogGraph(snapshot);

  it("emits Apply refactorings + Referenced by patterns for a smell", () => {
    const result = computeCrossReferencesForHref("/refactoring/smells/long-function", graph);

    const labels = result.groups.map((group) => group.label);
    expect(labels).toEqual(["Apply refactorings", "Referenced by patterns"]);
    const applyChips = result.groups[0]?.chips.map((chip) => chip.label);
    expect(applyChips).toEqual(["Extract Function", "Replace Temp with Query"]);
    const patternChips = result.groups[1]?.chips.map((chip) => chip.label);
    expect(patternChips).toEqual(["Compose Method"]);
  });

  it("emits Removes smells + Referenced by patterns for a refactoring", () => {
    const result = computeCrossReferencesForHref("/refactoring/canon/extract-function", graph);

    const labels = result.groups.map((group) => group.label);
    expect(labels).toEqual(["Removes smells", "Referenced by patterns"]);
  });

  it("emits Triggered by + Destination for a Kerievsky pattern that has a destination", () => {
    const result = computeCrossReferencesForHref(
      "/refactoring-to-patterns/encapsulate-classes-with-factory",
      graph,
    );

    const labels = result.groups.map((group) => group.label);
    expect(labels).toEqual(["Destination"]);
    expect(result.groups[0]?.chips[0]?.label).toBe("Factory Method");
  });

  it("emits Reached from for a GoF pattern", () => {
    const result = computeCrossReferencesForHref("/design-patterns/factory-method", graph);

    expect(result.groups.map((group) => group.label)).toEqual(["Reached from"]);
    expect(result.groups[0]?.chips[0]?.label).toBe("Encapsulate Classes With Factory");
  });

  it("returns empty cross-references for an href not in the graph", () => {
    const result = computeCrossReferencesForHref("/no/such/entry", graph);
    expect(result.groups).toEqual([]);
  });
});
