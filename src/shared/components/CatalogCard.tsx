import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CatalogNumber from "@/shared/components/CatalogNumber";
import ExpandableCatalogChip from "@/shared/components/ExpandableCatalogChip";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";
import { chipColorForTone } from "@/shared/lib/catalogChipColor";

interface CatalogCardProps {
  item: CatalogListItem;
}

export default function CatalogCard({ item }: CatalogCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", borderColor: `${chipColorForTone(item.tone)}.main` }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <CatalogNumber value={item.number} />
            <ExpandableCatalogChip label={item.name} href={item.href} tone={item.tone} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {item.caption}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
