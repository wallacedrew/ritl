import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface CatalogStatsProps {
  smellCount: number;
  refactoringCount: number;
  categoryCount: number;
  kerievskyPatternCount?: number;
  gofPatternCount?: number;
}

export default function CatalogStats({
  smellCount,
  refactoringCount,
  categoryCount,
  kerievskyPatternCount,
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
      {kerievskyPatternCount !== undefined && (
        <Typography variant="body2">
          <strong>{kerievskyPatternCount}</strong> Kerievsky patterns
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
