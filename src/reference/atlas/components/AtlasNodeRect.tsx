import { colorsForLayer } from "../lib/atlasColors";
import type { PositionedAtlasNode } from "../lib/layoutAtlasGraph";

interface Props {
  positionedNode: PositionedAtlasNode;
}

export default function AtlasNodeRect({ positionedNode }: Props) {
  const colors = colorsForLayer(positionedNode.layer);
  const textX = positionedNode.x + positionedNode.width / 2;
  const textY = positionedNode.y + positionedNode.height / 2;
  return (
    <g data-atlas-node-id={positionedNode.id.toString()}>
      <rect
        x={positionedNode.x}
        y={positionedNode.y}
        width={positionedNode.width}
        height={positionedNode.height}
        rx={4}
        ry={4}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1}
      />
      <text
        x={textX}
        y={textY}
        fill={colors.text}
        fontSize={12}
        fontFamily="inherit"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {positionedNode.label}
      </text>
    </g>
  );
}
