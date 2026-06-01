import type { CatalogEntry, CatalogEntryTone } from "@/shared/lib/CatalogEntry";
import type { CatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

import {
  crossReferences,
  type CrossReferenceChip,
  type CrossReferences,
  type RelationshipKind,
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
  const nodes = buildNodeIndex(allEntries);
  const { inboundByHref, destinationSourcesByHref } = buildEdgeIndexes(allEntries);
  return { nodes, inboundByHref, destinationSourcesByHref };
}

interface EdgeIndexes {
  readonly inboundByHref: Map<string, string[]>;
  readonly destinationSourcesByHref: Map<string, string[]>;
}

function buildEdgeIndexes(entries: readonly CatalogEntry[]): EdgeIndexes {
  const inboundByHref = new Map<string, string[]>();
  const destinationSourcesByHref = new Map<string, string[]>();
  for (const entry of entries) {
    const sourceHref = entry.name.toCatalogHref();
    for (const nemesis of entry.nemeses) {
      appendTo(inboundByHref, nemesis.toCatalogHref(), sourceHref);
    }
    if (entry.destinationPattern) {
      appendTo(destinationSourcesByHref, entry.destinationPattern.toCatalogHref(), sourceHref);
    }
  }
  return { inboundByHref, destinationSourcesByHref };
}

function buildNodeIndex(entries: readonly CatalogEntry[]): Map<string, CatalogNode> {
  const nodes = new Map<string, CatalogNode>();
  for (const entry of entries) {
    const href = entry.name.toCatalogHref();
    nodes.set(href, {
      href,
      name: entry.name.toString(),
      tone: entry.name.tone(),
      nemesisHrefs: entry.nemeses.map((nemesis) => nemesis.toCatalogHref()),
      destinationHref: entry.destinationPattern?.toCatalogHref(),
    });
  }
  return nodes;
}

function appendTo<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const existing = map.get(key);
  if (existing) {
    existing.push(value);
  } else {
    map.set(key, [value]);
  }
}

/**
 * Cross-reference dispatch table. Each tone declares the relationship
 * groups its detail view should render, and how to source the related
 * hrefs from the graph. Replaces four near-identical per-tone helpers
 * with one consult-then-render pass.
 */
type RelatedHrefsFor = (node: CatalogNode, graph: CatalogGraph) => readonly string[];

interface RelationshipGroupDescriptor {
  readonly kind: RelationshipKind;
  readonly hrefsFor: RelatedHrefsFor;
}

const outboundNemesisHrefs: RelatedHrefsFor = (node) => node.nemesisHrefs;

const destinationHrefAsList: RelatedHrefsFor = (node) =>
  node.destinationHref ? [node.destinationHref] : [];

const patternHrefsReferencing: RelatedHrefsFor = (node, graph) => {
  const allInbound = graph.inboundByHref.get(node.href) ?? [];
  return allInbound.filter((sourceHref) => {
    const source = graph.nodes.get(sourceHref);
    return source?.tone === "kerievsky-refactoring" || source?.tone === "pattern";
  });
};

const destinationSourceHrefs: RelatedHrefsFor = (node, graph) =>
  graph.destinationSourcesByHref.get(node.href) ?? [];

const TONE_GROUPS: Readonly<Record<CatalogEntryTone, readonly RelationshipGroupDescriptor[]>> = {
  smell: [
    { kind: "apply-refactorings", hrefsFor: outboundNemesisHrefs },
    { kind: "referenced-by-patterns", hrefsFor: patternHrefsReferencing },
  ],
  "fowler-refactoring": [
    { kind: "removes-smells", hrefsFor: outboundNemesisHrefs },
    { kind: "referenced-by-patterns", hrefsFor: patternHrefsReferencing },
  ],
  "kerievsky-refactoring": [
    { kind: "triggered-by", hrefsFor: outboundNemesisHrefs },
    { kind: "destination", hrefsFor: destinationHrefAsList },
  ],
  pattern: [{ kind: "reached-from", hrefsFor: destinationSourceHrefs }],
};

export function computeCrossReferencesForHref(href: string, graph: CatalogGraph): CrossReferences {
  const node = graph.nodes.get(href);
  if (!node) return crossReferences([]);
  return crossReferences(
    TONE_GROUPS[node.tone].map((descriptor) =>
      relationshipGroup(
        descriptor.kind,
        descriptor.hrefsFor(node, graph).map((targetHref) => chipFromGraph(targetHref, graph)),
      ),
    ),
  );
}

function chipFromGraph(href: string, graph: CatalogGraph): CrossReferenceChip {
  const node = graph.nodes.get(href);
  if (!node) {
    return { label: href, href, tone: "fowler-refactoring" };
  }
  return { label: node.name, href: node.href, tone: node.tone };
}
