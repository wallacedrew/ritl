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
  return {
    nodes: buildNodeIndex(allEntries),
    inboundByHref: buildInboundIndex(allEntries),
    destinationSourcesByHref: buildDestinationSourceIndex(allEntries),
  };
}

function buildDestinationSourceIndex(entries: readonly CatalogEntry[]): Map<string, string[]> {
  const destinationSourcesByHref = new Map<string, string[]>();
  for (const entry of entries) {
    if (!entry.destinationPattern) continue;
    appendTo(
      destinationSourcesByHref,
      entry.destinationPattern.toCatalogHref(),
      entry.name.toCatalogHref(),
    );
  }
  return destinationSourcesByHref;
}

function buildInboundIndex(entries: readonly CatalogEntry[]): Map<string, string[]> {
  const inboundByHref = new Map<string, string[]>();
  for (const entry of entries) {
    const sourceHref = entry.name.toCatalogHref();
    for (const nemesis of entry.nemeses) {
      appendTo(inboundByHref, nemesis.toCatalogHref(), sourceHref);
    }
  }
  return inboundByHref;
}

function buildNodeIndex(entries: readonly CatalogEntry[]): Map<string, CatalogNode> {
  const nodes = new Map<string, CatalogNode>();
  for (const entry of entries) {
    const node = toCatalogNode(entry);
    nodes.set(node.href, node);
  }
  return nodes;
}

function toCatalogNode(entry: CatalogEntry): CatalogNode {
  return {
    href: entry.name.toCatalogHref(),
    name: entry.name.toString(),
    tone: entry.name.tone(),
    nemesisHrefs: entry.nemeses.map((nemesis) => nemesis.toCatalogHref()),
    destinationHref: entry.destinationPattern?.toCatalogHref(),
  };
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
 * hrefs from the graph.
 */
type RelatedHrefsFor = (node: CatalogNode, graph: CatalogGraph) => readonly string[];

interface RelationshipGroupDescriptor {
  readonly kind: RelationshipKind;
  readonly hrefsFor: RelatedHrefsFor;
}

const outboundNemesisHrefs: RelatedHrefsFor = (node) => node.nemesisHrefs;

const destinationHrefAsList: RelatedHrefsFor = (node) =>
  node.destinationHref ? [node.destinationHref] : [];

const PATTERN_INBOUND_TONES: ReadonlySet<CatalogEntryTone> = new Set([
  "kerievsky-refactoring",
  "pattern",
]);

const patternHrefsReferencing: RelatedHrefsFor = (node, graph) => {
  const allInbound = graph.inboundByHref.get(node.href) ?? [];
  return allInbound.filter((sourceHref) => {
    const source = graph.nodes.get(sourceHref);
    return source !== undefined && PATTERN_INBOUND_TONES.has(source.tone);
  });
};

const destinationSourceHrefs: RelatedHrefsFor = (node, graph) =>
  graph.destinationSourcesByHref.get(node.href) ?? [];

const referencedByPatterns: RelationshipGroupDescriptor = {
  kind: "referenced-by-patterns",
  hrefsFor: patternHrefsReferencing,
};

const destination: RelationshipGroupDescriptor = {
  kind: "destination",
  hrefsFor: destinationHrefAsList,
};

const reachedFrom: RelationshipGroupDescriptor = {
  kind: "reached-from",
  hrefsFor: destinationSourceHrefs,
};

function outboundNemeses(kind: RelationshipKind): RelationshipGroupDescriptor {
  return { kind, hrefsFor: outboundNemesisHrefs };
}

const TONE_GROUPS: Readonly<Record<CatalogEntryTone, readonly RelationshipGroupDescriptor[]>> = {
  smell: [outboundNemeses("apply-refactorings"), referencedByPatterns],
  "fowler-refactoring": [outboundNemeses("removes-smells"), referencedByPatterns],
  "kerievsky-refactoring": [outboundNemeses("triggered-by"), destination],
  pattern: [reachedFrom],
};

export function computeCrossReferencesForHref(href: string, graph: CatalogGraph): CrossReferences {
  const node = graph.nodes.get(href);
  if (!node) return crossReferences([]);
  const groups = TONE_GROUPS[node.tone].map((descriptor) => {
    const relatedHrefs = descriptor.hrefsFor(node, graph);
    const chips = relatedHrefs.map((targetHref) => chipFromGraph(targetHref, graph));
    return relationshipGroup(descriptor.kind, chips);
  });
  return crossReferences(groups);
}

function chipFromGraph(href: string, graph: CatalogGraph): CrossReferenceChip {
  const node = graph.nodes.get(href);
  if (!node) {
    throw new Error(`CatalogGraph: chipFromGraph called with unresolved href "${href}"`);
  }
  return { label: node.name, href: node.href, tone: node.tone };
}
