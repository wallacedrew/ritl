import Box from "@mui/material/Box";

import CatalogCard from "@/shared/components/CatalogCard";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

interface SmellListProps {
  items: CatalogListItem[];
}

export default function SmellList({ items }: SmellListProps) {
  return (
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
  );
}
