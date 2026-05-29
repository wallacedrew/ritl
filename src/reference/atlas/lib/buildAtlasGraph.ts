import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

import type { AtlasLayer } from "./AtlasLayer";
import { AtlasNodeId } from "./AtlasNodeId";

export interface AtlasGraphInput {
  readonly refactorings: readonly CatalogEntry[];
  readonly smells: readonly CatalogEntry[];
  readonly patterns: readonly CatalogEntry[];
}

export interface AtlasNode {
  readonly id: AtlasNodeId;
  readonly label: string;
  readonly layer: AtlasLayer;
}

export interface AtlasEdge {
  readonly sourceId: AtlasNodeId;
  readonly targetId: AtlasNodeId;
}

export interface AtlasGraph {
  readonly nodes: readonly AtlasNode[];
  readonly edges: readonly AtlasEdge[];
}

export function buildAtlasGraph(input: AtlasGraphInput): AtlasGraph {
  const nodes = collectNodes(input);
  const knownNodeIds = indexNodeIds(nodes);
  return {
    nodes,
    edges: [
      ...collectNemesisEdges(input, knownNodeIds),
      ...collectDestinationEdges(input, knownNodeIds),
    ],
  };
}

function collectNodes(input: AtlasGraphInput): readonly AtlasNode[] {
  return [...input.smells, ...input.refactorings, ...input.patterns].map(toAtlasNode);
}

function toAtlasNode(entry: CatalogEntry): AtlasNode {
  return {
    id: AtlasNodeId.fromCatalogEntryName(entry.name),
    label: entry.name.toString(),
    layer: entry.name.tone(),
  };
}

function indexNodeIds(nodes: readonly AtlasNode[]): ReadonlySet<string> {
  return new Set(nodes.map((node) => node.id.toString()));
}

function collectNemesisEdges(
  input: AtlasGraphInput,
  knownNodeIds: ReadonlySet<string>,
): readonly AtlasEdge[] {
  return [...input.refactorings, ...input.patterns].flatMap((source) =>
    source.nemeses
      .map((nemesisName) => ({
        sourceId: AtlasNodeId.fromCatalogEntryName(source.name),
        targetId: AtlasNodeId.fromCatalogEntryName(nemesisName),
      }))
      .filter((edge) => knownNodeIds.has(edge.targetId.toString())),
  );
}

function collectDestinationEdges(
  input: AtlasGraphInput,
  knownNodeIds: ReadonlySet<string>,
): readonly AtlasEdge[] {
  return input.patterns.flatMap((pattern) => {
    const destination = pattern.destinationPattern;
    if (destination === undefined) return [];
    const edge: AtlasEdge = {
      sourceId: AtlasNodeId.fromCatalogEntryName(pattern.name),
      targetId: AtlasNodeId.fromCatalogEntryName(destination),
    };
    return knownNodeIds.has(edge.targetId.toString()) ? [edge] : [];
  });
}
