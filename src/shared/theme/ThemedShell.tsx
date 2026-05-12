"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

import { useColorMode } from "@/shared/hooks/useColorMode";
import { darkTheme, lightTheme } from "@/shared/theme/theme";

interface ThemedShellProps {
  children: ReactNode;
}

export default function ThemedShell({ children }: ThemedShellProps) {
  const { mode } = useColorMode();
  const activeTheme = mode === "dark" ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
