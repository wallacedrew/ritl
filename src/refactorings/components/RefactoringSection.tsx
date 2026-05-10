import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface RefactoringSectionProps {
  label: string;
  body: string;
}

export default function RefactoringSection({ label, body }: RefactoringSectionProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{body}</Typography>
    </Stack>
  );
}
