import type { AtlasLayout } from "../lib/layoutAtlasGraph";
import AtlasColumnHeading from "./AtlasColumnHeading";
import AtlasEdgePath from "./AtlasEdgePath";
import AtlasNodeRect from "./AtlasNodeRect";

interface Props {
  layout: AtlasLayout;
}

export default function AtlasCanvas({ layout }: Props) {
  const headingBaselineY = layout.columnHeaderHeight / 2;
  return (
    <svg
      role="img"
      aria-label="catalog atlas"
      width={layout.canvasWidth}
      height={layout.canvasHeight}
      viewBox={`0 0 ${layout.canvasWidth} ${layout.canvasHeight}`}
      style={{ display: "block" }}
    >
      <g data-atlas-edges>
        {layout.edges.map((positionedEdge) => (
          <AtlasEdgePath
            key={`${positionedEdge.sourceId.toString()}->${positionedEdge.targetId.toString()}`}
            positionedEdge={positionedEdge}
          />
        ))}
      </g>
      <g data-atlas-nodes>
        {layout.nodes.map((positionedNode) => (
          <AtlasNodeRect key={positionedNode.id.toString()} positionedNode={positionedNode} />
        ))}
      </g>
      <g data-atlas-headings>
        {layout.columns.map((column) => (
          <AtlasColumnHeading key={column.layer} column={column} baselineY={headingBaselineY} />
        ))}
      </g>
    </svg>
  );
}
