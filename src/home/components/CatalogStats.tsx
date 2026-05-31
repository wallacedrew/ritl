import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface CatalogStatsProps {
  smellCount: number;
  refactoringCount: number;
  categoryCount: number;
  kerievskyRefactoringCount?: number;
  gofPatternCount?: number;
}

export default function CatalogStats({
  smellCount,
  refactoringCount,
  categoryCount,
  kerievskyRefactoringCount,
  gofPatternCount,
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
      {kerievskyRefactoringCount !== undefined && (
        <Typography variant="body2">
          <strong>{kerievskyRefactoringCount}</strong> Kerievsky refactorings
        </Typography>
      )}
      {gofPatternCount !== undefined && (
        <Typography variant="body2">
          <strong>{gofPatternCount}</strong> GoF design patterns
        </Typography>
      )}
    </Stack>
  );
}
