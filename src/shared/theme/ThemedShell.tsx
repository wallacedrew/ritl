"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

import { theme } from "@/shared/theme/theme";

interface ThemedShellProps {
  children: ReactNode;
}

export default function ThemedShell({ children }: ThemedShellProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
