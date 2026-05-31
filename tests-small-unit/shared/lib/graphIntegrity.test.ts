import { describe, expect, it } from "vitest";

import { buildCatalogGraph } from "@/shared/lib/CatalogGraph";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

const graph = buildCatalogGraph(loadCatalogSnapshot());

describe("catalog graph integrity", () => {
  it("resolves every nemesis href on every entry to a node in the graph", () => {
    const unresolved: Array<{ from: string; nemesis: string }> = [];
    for (const node of graph.nodes.values()) {
      for (const nemesis of node.nemesisHrefs) {
        if (!graph.nodes.has(nemesis)) {
          unresolved.push({ from: node.href, nemesis });
        }
      }
    }
    expect(unresolved).toEqual([]);
  });

  it("resolves every destinationHref to a node in the graph", () => {
    const unresolved: Array<{ from: string; destination: string }> = [];
    for (const node of graph.nodes.values()) {
      if (node.destinationHref && !graph.nodes.has(node.destinationHref)) {
        unresolved.push({ from: node.href, destination: node.destinationHref });
      }
    }
    expect(unresolved).toEqual([]);
  });

  it("points every destinationHref at a GoF pattern node", () => {
    const wrongTone: Array<{ from: string; destination: string; tone: string }> = [];
    for (const node of graph.nodes.values()) {
      if (!node.destinationHref) continue;
      const target = graph.nodes.get(node.destinationHref);
      if (target && target.tone !== "pattern") {
        wrongTone.push({ from: node.href, destination: target.href, tone: target.tone });
      }
    }
    expect(wrongTone).toEqual([]);
  });

  it("resolves every inbound href to a node in the graph", () => {
    const unresolved: Array<{ target: string; source: string }> = [];
    for (const [targetHref, sources] of graph.inboundByHref.entries()) {
      for (const sourceHref of sources) {
        if (!graph.nodes.has(sourceHref)) {
          unresolved.push({ target: targetHref, source: sourceHref });
        }
      }
    }
    expect(unresolved).toEqual([]);
  });

  it("resolves every destination-source href to a node in the graph", () => {
    const unresolved: Array<{ target: string; source: string }> = [];
    for (const [targetHref, sources] of graph.destinationSourcesByHref.entries()) {
      for (const sourceHref of sources) {
        if (!graph.nodes.has(sourceHref)) {
          unresolved.push({ target: targetHref, source: sourceHref });
        }
      }
    }
    expect(unresolved).toEqual([]);
  });
});
