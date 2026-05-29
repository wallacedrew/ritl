import { describe, expect, it } from "vitest";

import { AtlasNodeId } from "@/reference/atlas/lib/AtlasNodeId";
import type { AtlasEdge, AtlasGraph, AtlasNode } from "@/reference/atlas/lib/buildAtlasGraph";
import { DEFAULT_ATLAS_LAYOUT, layoutAtlasGraph } from "@/reference/atlas/lib/layoutAtlasGraph";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

function node(name: CatalogEntryName, label: string): AtlasNode {
  return {
    id: AtlasNodeId.fromCatalogEntryName(name),
    label,
    layer: name.tone(),
  };
}

function edge(sourceName: CatalogEntryName, targetName: CatalogEntryName): AtlasEdge {
  return {
    sourceId: AtlasNodeId.fromCatalogEntryName(sourceName),
    targetId: AtlasNodeId.fromCatalogEntryName(targetName),
  };
}

const longFunction = CatalogEntryName.smell("Long Function");
const duplicatedCode = CatalogEntryName.smell("Duplicated Code");
const extractFunction = CatalogEntryName.refactoring("Extract Function");
const composeMethod = CatalogEntryName.pattern("Compose Method", "kerievsky");
const encapsulateClassesWithFactory = CatalogEntryName.pattern(
  "Encapsulate Classes With Factory",
  "kerievsky",
);
const factoryMethod = CatalogEntryName.pattern("Factory Method", "gof");

const fullGraph: AtlasGraph = {
  nodes: [
    node(longFunction, "Long Function"),
    node(duplicatedCode, "Duplicated Code"),
    node(extractFunction, "Extract Function"),
    node(composeMethod, "Compose Method"),
    node(encapsulateClassesWithFactory, "Encapsulate Classes With Factory"),
    node(factoryMethod, "Factory Method"),
  ],
  edges: [edge(extractFunction, longFunction), edge(encapsulateClassesWithFactory, factoryMethod)],
};

describe("layoutAtlasGraph", () => {
  it("places nodes in left-to-right column order by layer", () => {
    const layout = layoutAtlasGraph(fullGraph, DEFAULT_ATLAS_LAYOUT);

    const xByLayer = new Map<string, number>();
    for (const positioned of layout.nodes) {
      xByLayer.set(positioned.layer, positioned.x);
    }
    const smellX = xByLayer.get("smell") ?? 0;
    const refactoringX = xByLayer.get("refactoring") ?? 0;
    const kerievskyX = xByLayer.get("kerievsky-pattern") ?? 0;
    const gofX = xByLayer.get("gof-pattern") ?? 0;

    expect(smellX).toBeLessThan(refactoringX);
    expect(refactoringX).toBeLessThan(kerievskyX);
    expect(kerievskyX).toBeLessThan(gofX);
  });

  it("sorts nodes alphabetically within their column", () => {
    const layout = layoutAtlasGraph(fullGraph, DEFAULT_ATLAS_LAYOUT);

    const smells = layout.nodes
      .filter((positioned) => positioned.layer === "smell")
      .sort((first, second) => first.y - second.y);

    expect(smells.map((positioned) => positioned.label)).toEqual([
      "Duplicated Code",
      "Long Function",
    ]);
  });

  it("emits one column descriptor per layer with the right heading", () => {
    const layout = layoutAtlasGraph(fullGraph, DEFAULT_ATLAS_LAYOUT);

    expect(layout.columns.map((column) => column.heading)).toEqual([
      "Smells",
      "Refactorings",
      "Refactoring to Patterns",
      "Design Patterns",
    ]);
  });

  it("returns canvas dimensions large enough to contain every positioned node", () => {
    const layout = layoutAtlasGraph(fullGraph, DEFAULT_ATLAS_LAYOUT);

    for (const positioned of layout.nodes) {
      expect(positioned.x + positioned.width).toBeLessThanOrEqual(layout.canvasWidth);
      expect(positioned.y + positioned.height).toBeLessThanOrEqual(layout.canvasHeight);
    }
  });

  it("routes one positioned edge for each input edge whose endpoints both exist", () => {
    const layout = layoutAtlasGraph(fullGraph, DEFAULT_ATLAS_LAYOUT);

    expect(layout.edges).toHaveLength(2);
    const pathStrings = layout.edges.map((positioned) => positioned.path.toString());
    expect(pathStrings.every((path) => path.startsWith("M "))).toBe(true);
    expect(pathStrings.every((path) => path.includes(" C "))).toBe(true);
  });

  it("draws each edge curve left-to-right regardless of which endpoint is the logical source", () => {
    const tinyGraph: AtlasGraph = {
      nodes: [node(longFunction, "Long Function"), node(extractFunction, "Extract Function")],
      edges: [edge(extractFunction, longFunction)],
    };

    const layout = layoutAtlasGraph(tinyGraph, DEFAULT_ATLAS_LAYOUT);
    const refactoringNode = layout.nodes.find((positioned) => positioned.layer === "refactoring");
    const smellNode = layout.nodes.find((positioned) => positioned.layer === "smell");
    const [positionedEdge] = layout.edges;

    if (!refactoringNode || !smellNode || !positionedEdge) throw new Error("fixture broken");
    const leftAnchor = `M ${smellNode.x + smellNode.width} ${smellNode.y + smellNode.height / 2}`;
    const rightAnchor = `${refactoringNode.x} ${refactoringNode.y + refactoringNode.height / 2}`;
    expect(positionedEdge.path.toString().startsWith(leftAnchor)).toBe(true);
    expect(positionedEdge.path.toString().endsWith(rightAnchor)).toBe(true);
  });

  it("drops edges whose source or target is missing from the graph", () => {
    const orphanGraph: AtlasGraph = {
      nodes: [node(longFunction, "Long Function")],
      edges: [edge(extractFunction, longFunction)],
    };

    const layout = layoutAtlasGraph(orphanGraph, DEFAULT_ATLAS_LAYOUT);
    expect(layout.edges).toHaveLength(0);
  });
});
