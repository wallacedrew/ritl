import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import SiteHeader from "@/shared/components/SiteHeader";
import ThemeRegistry from "@/shared/theme/ThemeRegistry";

export const metadata: Metadata = {
  title: "Refactoring in the Large",
  description: "A catalog explorer for code smells and Fowler refactorings.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <SiteHeader />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
