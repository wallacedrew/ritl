import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import Box from "@mui/material/Box";
import SiteFooter from "@/shared/components/SiteFooter";
import SiteHeader from "@/shared/components/SiteHeader";
import { AnalyticsProvider } from "@/shared/theme/AnalyticsProvider";
import ThemeRegistry from "@/shared/theme/ThemeRegistry";

export const metadata: Metadata = {
  title: "Refactoring in the Loop",
  description:
    "A catalog explorer for code smells, Fowler refactorings, Kerievsky's refactoring patterns, and the Gang of Four design patterns.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AnalyticsProvider>
          <ThemeRegistry>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <SiteHeader />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <SiteFooter />
            </Box>
          </ThemeRegistry>
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
