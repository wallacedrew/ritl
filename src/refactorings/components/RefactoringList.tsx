import Box from "@mui/material/Box";

import type { RefactoringListItem } from "../lib/RefactoringListItem";
import RefactoringCard from "./RefactoringCard";

interface RefactoringListProps {
  items: RefactoringListItem[];
}

export default function RefactoringList({ items }: RefactoringListProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(320px, 1fr))" },
      }}
    >
      {items.map((item) => (
        <RefactoringCard key={item.name} item={item} />
      ))}
    </Box>
  );
}
