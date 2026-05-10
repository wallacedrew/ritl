import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { RefactoringListItem } from "../lib/RefactoringListItem";

interface RefactoringCardProps {
  item: RefactoringListItem;
}

export default function RefactoringCard({ item }: RefactoringCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography component="h2" variant="h6">
            {item.name}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {item.solves.map((smellName) => (
              <Chip key={smellName} label={smellName} size="small" variant="outlined" />
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {item.goal}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
