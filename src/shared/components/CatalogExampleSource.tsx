import Typography from "@mui/material/Typography";

interface CatalogExampleSourceProps {
  note: string;
}

export default function CatalogExampleSource({ note }: CatalogExampleSourceProps) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontStyle: "italic", display: "block" }}
    >
      Example source: {note}
    </Typography>
  );
}
