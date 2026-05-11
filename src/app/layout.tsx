import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import Box from "@mui/material/Box";
import SiteFooter from "@/shared/components/SiteFooter";
import SiteHeader from "@/shared/components/SiteHeader";
import ThemeRegistry from "@/shared/theme/ThemeRegistry";

export const metadata: Metadata = {
  title: "Refactoring in the Loop",
  description: "A catalog explorer for code smells and Fowler refactorings.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <SiteHeader />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <SiteFooter />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
