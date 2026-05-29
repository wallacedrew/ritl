import type { AtlasLayer } from "./AtlasLayer";

export interface AtlasLayerColors {
  readonly fill: string;
  readonly stroke: string;
  readonly text: string;
}

const SMELL_COLORS: AtlasLayerColors = {
  fill: "#fee2e2",
  stroke: "#b91c1c",
  text: "#7f1d1d",
};

const REFACTORING_COLORS: AtlasLayerColors = {
  fill: "#e0f2fe",
  stroke: "#0369a1",
  text: "#0c4a6e",
};

const KERIEVSKY_COLORS: AtlasLayerColors = {
  fill: "#fef3c7",
  stroke: "#b45309",
  text: "#78350f",
};

const GOF_COLORS: AtlasLayerColors = {
  fill: "#e0e7ff",
  stroke: "#4338ca",
  text: "#312e81",
};

const ATLAS_LAYER_COLORS: Readonly<Record<AtlasLayer, AtlasLayerColors>> = {
  smell: SMELL_COLORS,
  refactoring: REFACTORING_COLORS,
  "kerievsky-pattern": KERIEVSKY_COLORS,
  "gof-pattern": GOF_COLORS,
};

export const ATLAS_EDGE_STROKE = "#94a3b8";
export const ATLAS_COLUMN_HEADING_TEXT = "#0f172a";

export function colorsForLayer(layer: AtlasLayer): AtlasLayerColors {
  return ATLAS_LAYER_COLORS[layer];
}
