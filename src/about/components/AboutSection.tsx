import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function AboutSection({ title, children }: Props) {
  return (
    <Stack spacing={2} component="section">
      <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}
