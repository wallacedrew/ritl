import { describe, expect, it } from "vitest";

import { AtlasNodeId } from "@/reference/atlas/lib/AtlasNodeId";
import { buildAtlasGraph } from "@/reference/atlas/lib/buildAtlasGraph";
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
) {
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
  nemeses: [],
});

const factoryMethod = entry({
  catalog: "patterns",
  book: "gof",
  name: CatalogEntryName.pattern("Factory Method", "gof"),
  nemeses: [],
});

describe("buildAtlasGraph", () => {
  it("emits one node per input entry tagged with its atlas layer", () => {
    const graph = buildAtlasGraph({
      refactorings: [extractFunction],
      smells: [longFunction],
      patterns: [composeMethod, factoryMethod],
    });

    const layerById = new Map(graph.nodes.map((node) => [node.id.toString(), node.layer]));
    expect(layerById.get("smell:long-function")).toBe("smell");
    expect(layerById.get("refactoring:extract-function")).toBe("refactoring");
    expect(layerById.get("kerievsky-pattern:compose-method")).toBe("kerievsky-pattern");
    expect(layerById.get("gof-pattern:factory-method")).toBe("gof-pattern");
  });

  it("draws an edge from a refactoring to each smell named in its nemeses", () => {
    const graph = buildAtlasGraph({
      refactorings: [extractFunction],
      smells: [longFunction],
      patterns: [],
    });

    expect(graph.edges).toHaveLength(1);
    const [edge] = graph.edges;
    expect(edge?.sourceId.toString()).toBe("refactoring:extract-function");
    expect(edge?.targetId.toString()).toBe("smell:long-function");
  });

  it("draws an edge from a Kerievsky pattern to each refactoring and smell nemesis", () => {
    const graph = buildAtlasGraph({
      refactorings: [extractFunction],
      smells: [longFunction],
      patterns: [composeMethod],
    });

    const composeMethodEdges = graph.edges.filter(
      (edge) => edge.sourceId.toString() === "kerievsky-pattern:compose-method",
    );
    const targets = composeMethodEdges.map((edge) => edge.targetId.toString());
    expect(targets).toContain("smell:long-function");
    expect(targets).toContain("refactoring:extract-function");
  });

  it("draws a destinationPattern edge from a Kerievsky pattern to its GoF destination", () => {
    const graph = buildAtlasGraph({
      refactorings: [],
      smells: [],
      patterns: [encapsulateClassesWithFactory, factoryMethod],
    });

    const destinationEdges = graph.edges.filter(
      (edge) =>
        edge.sourceId.toString() === "kerievsky-pattern:encapsulate-classes-with-factory" &&
        edge.targetId.toString() === "gof-pattern:factory-method",
    );
    expect(destinationEdges).toHaveLength(1);
  });

  it("skips a nemesis edge whose target node is not in the input", () => {
    const refactoringWithDanglingNemesis = entry({
      catalog: "refactorings",
      name: CatalogEntryName.refactoring("Inline Function"),
      nemeses: [CatalogEntryName.smell("Nonexistent Smell")],
    });

    const graph = buildAtlasGraph({
      refactorings: [refactoringWithDanglingNemesis],
      smells: [],
      patterns: [],
    });

    expect(graph.edges).toHaveLength(0);
  });

  it("does not traverse smell.nemeses (which are the inverse of refactoring edges)", () => {
    const smellWithBackEdges = entry({
      catalog: "smells",
      name: CatalogEntryName.smell("Long Function"),
      nemeses: [CatalogEntryName.refactoring("Extract Function")],
    });

    const graph = buildAtlasGraph({
      refactorings: [extractFunction],
      smells: [smellWithBackEdges],
      patterns: [],
    });

    expect(graph.edges).toHaveLength(1);
    const [edge] = graph.edges;
    expect(edge?.sourceId.toString()).toBe("refactoring:extract-function");
  });

  it("returns AtlasNodeId values that round-trip equal", () => {
    const graph = buildAtlasGraph({
      refactorings: [extractFunction],
      smells: [longFunction],
      patterns: [],
    });

    const longFunctionNode = graph.nodes.find(
      (node) => node.id.toString() === "smell:long-function",
    );
    const expectedId = AtlasNodeId.fromCatalogEntryName(CatalogEntryName.smell("Long Function"));
    expect(longFunctionNode?.id.equals(expectedId)).toBe(true);
  });
});
