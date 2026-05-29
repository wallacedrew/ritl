import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface BookSectionProps {
  title: string;
  attribution: string;
  children: ReactNode;
}

export default function BookSection({ title, attribution, children }: BookSectionProps) {
  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography component="h2" variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {attribution}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
}
