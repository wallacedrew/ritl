import { ATLAS_LAYERS_LEFT_TO_RIGHT, ATLAS_LAYER_HEADINGS, type AtlasLayer } from "./AtlasLayer";
import type { AtlasEdge, AtlasGraph, AtlasNode } from "./buildAtlasGraph";
import type { AtlasNodeId } from "./AtlasNodeId";
import { Point } from "./Point";
import { SvgPathData } from "./SvgPathData";

export interface AtlasLayoutConfig {
  readonly columnWidth: number;
  readonly columnGutter: number;
  readonly columnHeaderHeight: number;
  readonly nodeHeight: number;
  readonly nodeVerticalGap: number;
  readonly canvasPaddingX: number;
  readonly canvasPaddingY: number;
}

export const DEFAULT_ATLAS_LAYOUT: AtlasLayoutConfig = {
  columnWidth: 220,
  columnGutter: 96,
  columnHeaderHeight: 36,
  nodeHeight: 28,
  nodeVerticalGap: 8,
  canvasPaddingX: 24,
  canvasPaddingY: 16,
};

export interface PositionedAtlasNode extends AtlasNode {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface PositionedAtlasEdge {
  readonly sourceId: AtlasNodeId;
  readonly targetId: AtlasNodeId;
  readonly path: SvgPathData;
}

export interface PositionedAtlasColumn {
  readonly layer: AtlasLayer;
  readonly heading: string;
  readonly x: number;
  readonly width: number;
}

export interface AtlasLayout {
  readonly columns: readonly PositionedAtlasColumn[];
  readonly nodes: readonly PositionedAtlasNode[];
  readonly edges: readonly PositionedAtlasEdge[];
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly columnHeaderHeight: number;
}

export function layoutAtlasGraph(graph: AtlasGraph, config: AtlasLayoutConfig): AtlasLayout {
  const nodesByLayer = orderNodesAlphabeticallyByLayer(graph.nodes);
  const columns = assignColumns(config);
  const positionedNodes = positionNodes(nodesByLayer, columns, config);
  const nodesById = indexById(positionedNodes);
  const positionedEdges = routeEdges(graph.edges, nodesById);
  return {
    columns,
    nodes: positionedNodes,
    edges: positionedEdges,
    canvasWidth: calculateCanvasWidth(columns, config),
    canvasHeight: calculateCanvasHeight(nodesByLayer, config),
    columnHeaderHeight: config.columnHeaderHeight,
  };
}

function orderNodesAlphabeticallyByLayer(
  nodes: readonly AtlasNode[],
): ReadonlyMap<AtlasLayer, readonly AtlasNode[]> {
  const grouped = new Map<AtlasLayer, AtlasNode[]>();
  for (const layer of ATLAS_LAYERS_LEFT_TO_RIGHT) {
    grouped.set(layer, []);
  }
  for (const atlasNode of nodes) {
    grouped.get(atlasNode.layer)?.push(atlasNode);
  }
  for (const layerNodes of grouped.values()) {
    layerNodes.sort((first, second) => first.label.localeCompare(second.label));
  }
  return grouped;
}

function assignColumns(config: AtlasLayoutConfig): readonly PositionedAtlasColumn[] {
  return ATLAS_LAYERS_LEFT_TO_RIGHT.map((layer, columnIndex) => ({
    layer,
    heading: ATLAS_LAYER_HEADINGS[layer],
    x: config.canvasPaddingX + columnIndex * (config.columnWidth + config.columnGutter),
    width: config.columnWidth,
  }));
}

function positionNodes(
  nodesByLayer: ReadonlyMap<AtlasLayer, readonly AtlasNode[]>,
  columns: readonly PositionedAtlasColumn[],
  config: AtlasLayoutConfig,
): readonly PositionedAtlasNode[] {
  return columns.flatMap((column) => positionColumnNodes(column, nodesByLayer, config));
}

function positionColumnNodes(
  column: PositionedAtlasColumn,
  nodesByLayer: ReadonlyMap<AtlasLayer, readonly AtlasNode[]>,
  config: AtlasLayoutConfig,
): readonly PositionedAtlasNode[] {
  const columnNodes = nodesByLayer.get(column.layer) ?? [];
  const topOfFirstNode = config.canvasPaddingY + config.columnHeaderHeight;
  return columnNodes.map((atlasNode, rowIndex) => ({
    ...atlasNode,
    x: column.x,
    y: topOfFirstNode + rowIndex * (config.nodeHeight + config.nodeVerticalGap),
    width: column.width,
    height: config.nodeHeight,
  }));
}

function indexById(
  positionedNodes: readonly PositionedAtlasNode[],
): ReadonlyMap<string, PositionedAtlasNode> {
  return new Map(positionedNodes.map((positioned) => [positioned.id.toString(), positioned]));
}

function routeEdges(
  edges: readonly AtlasEdge[],
  nodesById: ReadonlyMap<string, PositionedAtlasNode>,
): readonly PositionedAtlasEdge[] {
  return edges.flatMap((edge) => {
    const source = nodesById.get(edge.sourceId.toString());
    const target = nodesById.get(edge.targetId.toString());
    if (!source || !target) return [];
    return [
      {
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        path: buildEdgeCurve(source, target),
      },
    ];
  });
}

function buildEdgeCurve(source: PositionedAtlasNode, target: PositionedAtlasNode): SvgPathData {
  const [leftNode, rightNode] = source.x <= target.x ? [source, target] : [target, source];
  const leftAnchor = Point.at(leftNode.x + leftNode.width, leftNode.y + leftNode.height / 2);
  const rightAnchor = Point.at(rightNode.x, rightNode.y + rightNode.height / 2);
  return SvgPathData.curveBetween(leftAnchor, rightAnchor);
}

function calculateCanvasWidth(
  columns: readonly PositionedAtlasColumn[],
  config: AtlasLayoutConfig,
): number {
  const lastColumn = columns[columns.length - 1];
  if (!lastColumn) return config.canvasPaddingX * 2;
  return lastColumn.x + lastColumn.width + config.canvasPaddingX;
}

function calculateCanvasHeight(
  nodesByLayer: ReadonlyMap<AtlasLayer, readonly AtlasNode[]>,
  config: AtlasLayoutConfig,
): number {
  let tallestColumnCount = 0;
  for (const layerNodes of nodesByLayer.values()) {
    if (layerNodes.length > tallestColumnCount) tallestColumnCount = layerNodes.length;
  }
  const nodeStripHeight =
    tallestColumnCount * config.nodeHeight +
    Math.max(0, tallestColumnCount - 1) * config.nodeVerticalGap;
  return (
    config.canvasPaddingY + config.columnHeaderHeight + nodeStripHeight + config.canvasPaddingY
  );
}
