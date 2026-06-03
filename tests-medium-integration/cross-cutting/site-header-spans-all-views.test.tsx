import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SiteHeader from "@/shared/components/SiteHeader";
import { RecordingAnalyticsTracker } from "@/shared/adapters/RecordingAnalyticsTracker";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("site header spans every catalog view", () => {
  it("shows the app title and search as a persistent banner", () => {
    renderWithTheme(<SiteHeader />);

    expect(screen.getByText("Refactoring In The Loop")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders the catalog navigation as a semantic nav with one link per view", () => {
    renderWithTheme(<SiteHeader />);

    const nav = screen.getByRole("navigation", { name: /catalog/i });
    expect(nav).toBeInTheDocument();

    const refactoringsLink = screen.getByRole("link", { name: /^Refactorings$/ });
    expect(refactoringsLink).toHaveAttribute("href", "/refactoring/canon");

    const smellsLink = screen.getByRole("link", { name: /^Smells$/ });
    expect(smellsLink).toHaveAttribute("href", "/refactoring/smells");

    const referenceLink = screen.getByRole("link", { name: /^Reference$/ });
    expect(referenceLink).toHaveAttribute("href", "/reference");
  });

  it("marks the About tab as the current page when the user is on the home route", () => {
    renderWithTheme(<SiteHeader />);

    const aboutLink = screen.getByRole("link", { name: /^About$/ });
    expect(aboutLink).toHaveAttribute("aria-current", "page");
  });

  it("fires nav_clicked with the link name when the user clicks a catalog nav link", async () => {
    const analytics = new RecordingAnalyticsTracker();
    const user = userEvent.setup();

    renderWithTheme(<SiteHeader />, { analytics });

    await user.click(screen.getByRole("link", { name: /^Smells$/ }));

    expect(analytics.calls).toContainEqual({
      event: "nav_clicked",
      properties: { tab: "smells" },
    });
  });
});
