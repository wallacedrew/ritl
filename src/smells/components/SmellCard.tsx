import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { SmellListItem } from "../lib/SmellListItem";

interface SmellCardProps {
  item: SmellListItem;
}

export default function SmellCard({ item }: SmellCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography component="h2" variant="h6">
            {item.name}
          </Typography>
          <Chip
            label={item.refactoring}
            color="primary"
            size="small"
            sx={{ alignSelf: "flex-start" }}
          />
          <Typography variant="body2" color="text.secondary">
            {item.symptom}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
