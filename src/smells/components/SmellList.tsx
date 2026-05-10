import Box from "@mui/material/Box";

import type { Smell } from "../lib/Smell";
import SmellCard from "./SmellCard";

interface SmellListProps {
  smells: Smell[];
}

export default function SmellList({ smells }: SmellListProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(320px, 1fr))" },
      }}
    >
      {smells.map((smell) => (
        <SmellCard key={smell.name} smell={smell} />
      ))}
    </Box>
  );
}
