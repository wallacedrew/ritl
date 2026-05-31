import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactElement, ReactNode } from "react";

import type { AnalyticsTracker } from "@/shared/lib/AnalyticsTracker";
import type { SnippetSource } from "@/shared/lib/SnippetSource";
import { AnalyticsProvider } from "@/shared/theme/AnalyticsProvider";
import { SnippetSourceProvider } from "@/shared/theme/SnippetSourceProvider";
import { theme } from "@/shared/theme/theme";

interface RenderWithThemeOptions extends Omit<RenderOptions, "wrapper"> {
  analytics?: AnalyticsTracker;
  snippetSource?: SnippetSource;
}

export function renderWithTheme(ui: ReactElement, options?: RenderWithThemeOptions) {
  const { analytics, snippetSource, ...renderOptions } = options ?? {};

  function ThemeWrapper({ children }: { children: ReactNode }) {
    return (
      <AnalyticsProvider tracker={analytics}>
        <SnippetSourceProvider source={snippetSource}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </SnippetSourceProvider>
      </AnalyticsProvider>
    );
  }

  return render(ui, { wrapper: ThemeWrapper, ...renderOptions });
}
