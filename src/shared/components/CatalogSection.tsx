import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface CatalogSectionProps {
  label: string;
  body: string;
}

export default function CatalogSection({ label, body }: CatalogSectionProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{body}</Typography>
    </Stack>
  );
}
