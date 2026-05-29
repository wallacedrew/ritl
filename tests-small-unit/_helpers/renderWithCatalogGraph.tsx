import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactElement, ReactNode } from "react";

import { buildCatalogGraph, type CatalogGraph } from "@/shared/lib/CatalogGraph";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";
import type { AnalyticsTracker } from "@/shared/lib/AnalyticsTracker";
import { AnalyticsProvider } from "@/shared/theme/AnalyticsProvider";
import { CatalogGraphProvider } from "@/shared/theme/CatalogGraphProvider";
import { theme } from "@/shared/theme/theme";

interface RenderWithCatalogGraphOptions extends Omit<RenderOptions, "wrapper"> {
  analytics?: AnalyticsTracker;
  graph?: CatalogGraph;
}

let cachedGraph: CatalogGraph | null = null;
function defaultGraph(): CatalogGraph {
  if (cachedGraph === null) {
    cachedGraph = buildCatalogGraph(loadCatalogSnapshot());
  }
  return cachedGraph;
}

export function renderWithCatalogGraph(ui: ReactElement, options?: RenderWithCatalogGraphOptions) {
  const { analytics, graph, ...renderOptions } = options ?? {};
  const resolvedGraph = graph ?? defaultGraph();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AnalyticsProvider tracker={analytics}>
        <CatalogGraphProvider graph={resolvedGraph}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </CatalogGraphProvider>
      </AnalyticsProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
