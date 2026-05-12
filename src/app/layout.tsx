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
  description: "A catalog explorer for code smells and Fowler refactorings.",
};

// Inline script runs synchronously before React hydration. Reads the
// persisted color mode from localStorage and sets data-color-mode on
// <html> so globals.css can paint the body background in the user's
// theme before MUI's emotion stylesheet kicks in — no flash of wrong
// theme on initial load. Keep this small; it ships inline on every page.
const PRE_PAINT_THEME_SCRIPT = `
(function(){try{var m=localStorage.getItem("ritl-color-mode");if(m!=="light"&&m!=="dark"){m="dark"}document.documentElement.setAttribute("data-color-mode",m)}catch(e){document.documentElement.setAttribute("data-color-mode","dark")}})();
`.trim();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-color-mode="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_THEME_SCRIPT }} />
      </head>
      <body>
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
