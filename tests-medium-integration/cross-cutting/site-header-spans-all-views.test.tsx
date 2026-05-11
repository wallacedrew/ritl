import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SiteHeader from "@/shared/components/SiteHeader";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("site header spans every catalog view", () => {
  it("shows the app title and subtitle as a persistent banner", () => {
    renderWithTheme(<SiteHeader />);

    expect(screen.getByText("Refactoring in the Large")).toBeInTheDocument();
    expect(screen.getByText(/catalog explorer/i)).toBeInTheDocument();
  });

  it("renders the three-tab catalog navigation with links to each view", () => {
    renderWithTheme(<SiteHeader />);

    const smellsTab = screen.getByRole("tab", { name: /Smells/ });
    expect(smellsTab).toHaveAttribute("href", "/smells");

    const refactoringsTab = screen.getByRole("tab", { name: /Refactorings/ });
    expect(refactoringsTab).toHaveAttribute("href", "/refactorings");

    const referenceTab = screen.getByRole("tab", { name: /Reference/ });
    expect(referenceTab).toHaveAttribute("href", "/");
  });
});
