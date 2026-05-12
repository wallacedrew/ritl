import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactElement, ReactNode } from "react";

import type { AnalyticsTracker } from "@/shared/lib/AnalyticsTracker";
import { AnalyticsProvider } from "@/shared/theme/AnalyticsProvider";
import { ColorModeProvider } from "@/shared/theme/ColorModeContext";
import { theme } from "@/shared/theme/theme";

interface RenderWithThemeOptions extends Omit<RenderOptions, "wrapper"> {
  analytics?: AnalyticsTracker;
}

export function renderWithTheme(ui: ReactElement, options?: RenderWithThemeOptions) {
  const { analytics, ...renderOptions } = options ?? {};

  function ThemeWrapper({ children }: { children: ReactNode }) {
    return (
      <ColorModeProvider>
        <AnalyticsProvider tracker={analytics}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AnalyticsProvider>
      </ColorModeProvider>
    );
  }

  return render(ui, { wrapper: ThemeWrapper, ...renderOptions });
}
