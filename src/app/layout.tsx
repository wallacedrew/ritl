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

const CLOUDFLARE_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
        {CLOUDFLARE_BEACON_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token":"${CLOUDFLARE_BEACON_TOKEN}"}`}
          />
        )}
      </body>
    </html>
  );
}
