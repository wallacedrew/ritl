import Box from "@mui/material/Box";
import type { ReactElement } from "react";

interface Props {
  children: ReactElement | ReactElement[];
}

export default function PillButtonGroup({ children }: Props) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "stretch",
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}
