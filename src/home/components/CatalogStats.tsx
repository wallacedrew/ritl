import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface CatalogStatsProps {
  smellCount: number;
  refactoringCount: number;
  categoryCount: number;
}

export default function CatalogStats({
  smellCount,
  refactoringCount,
  categoryCount,
}: CatalogStatsProps) {
  return (
    <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap", color: "text.secondary" }}>
      <Typography variant="body2">
        <strong>{smellCount}</strong> smells
      </Typography>
      <Typography variant="body2">
        <strong>{refactoringCount}</strong> refactorings
      </Typography>
      <Typography variant="body2">
        <strong>{categoryCount}</strong> categories
      </Typography>
    </Stack>
  );
}
