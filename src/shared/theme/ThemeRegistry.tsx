import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { ReactNode } from "react";

import ThemedShell from "@/shared/theme/ThemedShell";

interface ThemeRegistryProps {
  children: ReactNode;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <AppRouterCacheProvider>
      <ThemedShell>{children}</ThemedShell>
    </AppRouterCacheProvider>
  );
}
