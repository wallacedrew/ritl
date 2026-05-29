import { ATLAS_COLUMN_HEADING_TEXT } from "../lib/atlasColors";
import type { PositionedAtlasColumn } from "../lib/layoutAtlasGraph";

interface Props {
  column: PositionedAtlasColumn;
  baselineY: number;
}

export default function AtlasColumnHeading({ column, baselineY }: Props) {
  const textX = column.x + column.width / 2;
  return (
    <text
      x={textX}
      y={baselineY}
      fill={ATLAS_COLUMN_HEADING_TEXT}
      fontSize={13}
      fontFamily="inherit"
      fontWeight={600}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {column.heading}
    </text>
  );
}
