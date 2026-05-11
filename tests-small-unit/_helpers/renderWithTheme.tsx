import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactElement, ReactNode } from "react";

import { ColorModeProvider } from "@/shared/theme/ColorModeContext";
import { theme } from "@/shared/theme/theme";

function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <ColorModeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeProvider>
  );
}

export function renderWithTheme(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: ThemeWrapper, ...options });
}
