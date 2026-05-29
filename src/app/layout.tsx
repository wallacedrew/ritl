import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import Box from "@mui/material/Box";
import SiteFooter from "@/shared/components/SiteFooter";
import SiteHeader from "@/shared/components/SiteHeader";
import { buildCatalogGraph } from "@/shared/lib/CatalogGraph";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";
import { AnalyticsProvider } from "@/shared/theme/AnalyticsProvider";
import { CatalogGraphProvider } from "@/shared/theme/CatalogGraphProvider";
import ThemeRegistry from "@/shared/theme/ThemeRegistry";

export const metadata: Metadata = {
  title: "Refactoring In The Loop",
  description:
    "A catalog explorer for code smells, Fowler refactorings, Kerievsky's refactoring patterns, and the Gang of Four design patterns.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const catalogGraph = buildCatalogGraph(loadCatalogSnapshot());

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AnalyticsProvider>
          <CatalogGraphProvider graph={catalogGraph}>
            <ThemeRegistry>
              <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <SiteHeader />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  {children}
                </Box>
                <SiteFooter />
              </Box>
            </ThemeRegistry>
          </CatalogGraphProvider>
        </AnalyticsProvider>
        {/*
          Pageviews + Core Web Vitals are auto-injected by Cloudflare Pages
          (Web Analytics is on by default for refactoringintheloop.com).
          We don't manually load the beacon script — doing so would
          duplicate the request CF already makes server-side.

          Custom user-action events (plugin install copy, snippet
          download, etc.) are dispatched separately via the
          AnalyticsProvider → BeaconAnalyticsTracker → /api/track flow.
        */}
      </body>
    </html>
  );
}
