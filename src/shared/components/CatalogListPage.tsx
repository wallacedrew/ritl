import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import CatalogCard from "@/shared/components/CatalogCard";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

interface CatalogListPageProps {
  title: string;
  description: string;
  note?: string;
  items: readonly CatalogListItem[];
}

export default function CatalogListPage({ title, description, note, items }: CatalogListPageProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography component="h1" sx={visuallyHidden}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
          {note && (
            <Typography variant="body2" color="text.secondary">
              {note}
            </Typography>
          )}
        </Stack>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(320px, 1fr))" },
          }}
        >
          {items.map((item) => (
            <CatalogCard key={item.name} item={item} />
          ))}
        </Box>
      </Stack>
    </Container>
  );
}
