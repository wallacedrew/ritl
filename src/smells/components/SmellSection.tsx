import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface SmellSectionProps {
  label: string;
  body: string;
}

export default function SmellSection({ label, body }: SmellSectionProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{body}</Typography>
    </Stack>
  );
}
