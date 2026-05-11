"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactNode } from "react";

import { ColorModeProvider, useColorMode } from "./ColorModeContext";
import { darkTheme, lightTheme } from "./theme";

function ThemedShell({ children }: { children: ReactNode }) {
  const { mode } = useColorMode();
  const activeTheme = mode === "dark" ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ColorModeProvider>
        <ThemedShell>{children}</ThemedShell>
      </ColorModeProvider>
    </AppRouterCacheProvider>
  );
}
