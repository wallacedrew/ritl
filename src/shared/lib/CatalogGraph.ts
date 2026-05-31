import type { CatalogEntryTone } from "@/shared/lib/CatalogEntry";
import type { CatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

import {
  crossReferences,
  type CrossReferenceChip,
  type CrossReferences,
  relationshipGroup,
} from "./RelationshipGroup";

export interface CatalogNode {
  readonly href: string;
  readonly name: string;
  readonly tone: CatalogEntryTone;
  readonly nemesisHrefs: readonly string[];
  readonly destinationHref?: string;
}

export interface CatalogGraph {
  readonly nodes: ReadonlyMap<string, CatalogNode>;
  readonly inboundByHref: ReadonlyMap<string, readonly string[]>;
  readonly destinationSourcesByHref: ReadonlyMap<string, readonly string[]>;
}

export function buildCatalogGraph(snapshot: CatalogSnapshot): CatalogGraph {
  const allEntries = [...snapshot.smells, ...snapshot.refactorings, ...snapshot.patterns];
  const nodes = new Map<string, CatalogNode>();
  const inboundByHref = new Map<string, string[]>();
  const destinationSourcesByHref = new Map<string, string[]>();

  for (const entry of allEntries) {
    const href = entry.name.toCatalogHref();
    nodes.set(href, {
      href,
      name: entry.name.toString(),
      tone: entry.name.tone(),
      nemesisHrefs: entry.nemeses.map((nemesis) => nemesis.toCatalogHref()),
      destinationHref: entry.destinationPattern?.toCatalogHref(),
    });
  }

  for (const entry of allEntries) {
    const sourceHref = entry.name.toCatalogHref();
    for (const nemesis of entry.nemeses) {
      appendTo(inboundByHref, nemesis.toCatalogHref(), sourceHref);
    }
    if (entry.destinationPattern) {
      appendTo(destinationSourcesByHref, entry.destinationPattern.toCatalogHref(), sourceHref);
    }
  }

  return { nodes, inboundByHref, destinationSourcesByHref };
}

function appendTo<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const existing = map.get(key);
  if (existing) {
    existing.push(value);
  } else {
    map.set(key, [value]);
  }
}

export function computeCrossReferencesForHref(href: string, graph: CatalogGraph): CrossReferences {
  const node = graph.nodes.get(href);
  if (!node) return crossReferences([]);
  switch (node.tone) {
    case "smell":
      return smellCrossReferences(node, graph);
    case "fowler-refactoring":
      return refactoringCrossReferences(node, graph);
    case "kerievsky-refactoring":
      return kerievskyCrossReferences(node, graph);
    case "pattern":
      return gofCrossReferences(node, graph);
  }
}

function smellCrossReferences(node: CatalogNode, graph: CatalogGraph): CrossReferences {
  return crossReferences([
    relationshipGroup(
      "apply-refactorings",
      node.nemesisHrefs.map((nemesisHref) => chipFromGraph(nemesisHref, graph)),
    ),
    relationshipGroup(
      "referenced-by-patterns",
      patternsReferencing(node.href, graph).map((sourceHref) => chipFromGraph(sourceHref, graph)),
    ),
  ]);
}

function refactoringCrossReferences(node: CatalogNode, graph: CatalogGraph): CrossReferences {
  return crossReferences([
    relationshipGroup(
      "removes-smells",
      node.nemesisHrefs.map((nemesisHref) => chipFromGraph(nemesisHref, graph)),
    ),
    relationshipGroup(
      "referenced-by-patterns",
      patternsReferencing(node.href, graph).map((sourceHref) => chipFromGraph(sourceHref, graph)),
    ),
  ]);
}

function kerievskyCrossReferences(node: CatalogNode, graph: CatalogGraph): CrossReferences {
  return crossReferences([
    relationshipGroup(
      "triggered-by",
      node.nemesisHrefs.map((nemesisHref) => chipFromGraph(nemesisHref, graph)),
    ),
    relationshipGroup(
      "destination",
      node.destinationHref ? [chipFromGraph(node.destinationHref, graph)] : [],
    ),
  ]);
}

function gofCrossReferences(node: CatalogNode, graph: CatalogGraph): CrossReferences {
  const sources = graph.destinationSourcesByHref.get(node.href) ?? [];
  return crossReferences([
    relationshipGroup(
      "reached-from",
      sources.map((sourceHref) => chipFromGraph(sourceHref, graph)),
    ),
  ]);
}

function patternsReferencing(targetHref: string, graph: CatalogGraph): readonly string[] {
  const allInbound = graph.inboundByHref.get(targetHref) ?? [];
  return allInbound.filter((sourceHref) => {
    const source = graph.nodes.get(sourceHref);
    return source?.tone === "kerievsky-refactoring" || source?.tone === "pattern";
  });
}

function chipFromGraph(href: string, graph: CatalogGraph): CrossReferenceChip {
  const node = graph.nodes.get(href);
  if (!node) {
    return { label: href, href, tone: "fowler-refactoring" };
  }
  return { label: node.name, href: node.href, tone: node.tone };
}
