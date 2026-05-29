import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import HomePage from "@/home/HomePage";
import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";

describe("user picks a sub-site from the home page picker", () => {
  it("home page offers a Refactoring (Fowler) card linking to the refactorings list", () => {
    renderWithTheme(<HomePage />);

    const fowlerCardLink = screen.getByRole("link", { name: "Refactoring" });
    expect(fowlerCardLink).toHaveAttribute("href", "/refactoring/refactorings");
  });

  it("home page also offers a Refactoring to Patterns (Kerievsky) card linking to /refactoring-to-patterns", () => {
    renderWithTheme(<HomePage />);

    const kerievskyCardLink = screen.getByRole("link", { name: "Refactoring to Patterns" });
    expect(kerievskyCardLink).toHaveAttribute("href", "/refactoring-to-patterns");
  });

  it("home page offers a Design Patterns (GoF) card linking to /design-patterns", () => {
    renderWithTheme(<HomePage />);

    const gofCardLink = screen.getByRole("link", { name: "Design Patterns" });
    expect(gofCardLink).toHaveAttribute("href", "/design-patterns");
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
