import Box from "@mui/material/Box";

import type { SmellListItem } from "../lib/SmellListItem";
import SmellCard from "./SmellCard";

interface SmellListProps {
  items: SmellListItem[];
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
        <SmellCard key={item.name} item={item} />
      ))}
    </Box>
  );
}
