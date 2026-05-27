import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import HomePage from "@/home/HomePage";
import FowlerLandingPage from "@/refactoring/FowlerLandingPage";
import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";

describe("user picks a sub-site from the home page picker", () => {
  it("home page offers a Refactoring (Fowler) card linking to /refactoring", () => {
    renderWithTheme(<HomePage />);

    const fowlerCardLink = screen.getByRole("link", { name: /Refactoring/i });
    expect(fowlerCardLink).toHaveAttribute("href", "/refactoring");
  });

  it("Fowler landing shows chapter groupings and links into catalog list pages", () => {
    renderWithTheme(<FowlerLandingPage />);

    expect(screen.getByRole("heading", { name: /Composing Methods/i })).toBeInTheDocument();

    const refactoringsLink = screen.getByRole("link", { name: /browse all refactorings/i });
    expect(refactoringsLink).toHaveAttribute("href", "/refactoring/refactorings");

    const smellsLink = screen.getByRole("link", { name: /browse all smells/i });
    expect(smellsLink).toHaveAttribute("href", "/refactoring/smells");
  });

  it("refactoring detail pages render at /refactoring/refactorings/:slug", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "extract-function" }),
    });
    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Extract Function", level: 1 })).toBeInTheDocument();

    const agentLink = screen.getByRole("link", { name: "Agent" });
    expect(agentLink).toHaveAttribute("href", "/refactoring/refactorings/extract-function/agent");

    const compareLink = screen.getByRole("link", { name: "Compare" });
    expect(compareLink).toHaveAttribute(
      "href",
      "/refactoring/refactorings/extract-function/compare",
    );
  });
});
