import { ATLAS_EDGE_STROKE } from "../lib/atlasColors";
import type { PositionedAtlasEdge } from "../lib/layoutAtlasGraph";

interface Props {
  positionedEdge: PositionedAtlasEdge;
}

export default function AtlasEdgePath({ positionedEdge }: Props) {
  return (
    <path
      data-atlas-edge
      data-source-id={positionedEdge.sourceId.toString()}
      data-target-id={positionedEdge.targetId.toString()}
      d={positionedEdge.path.toString()}
      fill="none"
      stroke={ATLAS_EDGE_STROKE}
      strokeWidth={1}
      strokeOpacity={0.55}
    />
  );
}
