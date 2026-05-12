"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { ReactNode } from "react";

import { ColorModeProvider } from "@/shared/theme/ColorModeContext";
import ThemedShell from "@/shared/theme/ThemedShell";

interface ThemeRegistryProps {
  children: ReactNode;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <AppRouterCacheProvider>
      <ColorModeProvider>
        <ThemedShell>{children}</ThemedShell>
      </ColorModeProvider>
    </AppRouterCacheProvider>
  );
}
