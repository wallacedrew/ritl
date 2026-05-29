import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export default function CatalogMapSection({ title, description, children }: Props) {
  return (
    <Box component="section" sx={{ py: 2 }}>
      <Stack spacing={1.5}>
        <Stack spacing={0.5}>
          <Typography component="h2" variant="h6" sx={{ lineHeight: 1.3 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}
