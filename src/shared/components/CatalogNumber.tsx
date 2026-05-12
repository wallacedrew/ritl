import Typography from "@mui/material/Typography";

import { MONOSPACE_FONT } from "@/shared/theme/monospace";

interface CatalogNumberProps {
  value: number;
  size?: "small" | "large";
}

export default function CatalogNumber({ value, size = "small" }: CatalogNumberProps) {
  const formatted = String(value).padStart(2, "0");

  return (
    <Typography
      component="span"
      variant={size === "large" ? "h6" : "overline"}
      color="text.secondary"
      sx={{
        fontFamily: MONOSPACE_FONT,
        fontVariantNumeric: "tabular-nums",
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {formatted}
    </Typography>
  );
}
