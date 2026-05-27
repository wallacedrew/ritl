import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import FowlerLandingPage from "@/refactoring/FowlerLandingPage";

describe("user reads the Fowler landing at /refactoring", () => {
  it("shows catalog stats — 24 smells, 66 refactorings", () => {
    renderWithTheme(<FowlerLandingPage />);

    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("66")).toBeInTheDocument();
    expect(screen.getAllByText(/smells/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/refactorings/i).length).toBeGreaterThanOrEqual(1);
  });

  it("shows refactorings grouped by Fowler category, each chip links to the refactoring detail", () => {
    renderWithTheme(<FowlerLandingPage />);

    expect(screen.getByRole("heading", { name: /Composing Methods/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Inheritance/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Simplifying Conditional Logic/i }),
    ).toBeInTheDocument();

    const extractFunctionLinks = screen.getAllByRole("link", { name: "Extract Function" });
    expect(extractFunctionLinks[0]).toHaveAttribute(
      "href",
      "/refactoring/refactorings/extract-function",
    );
  });

  it("offers browse buttons that link into the refactorings and smells lists", () => {
    renderWithTheme(<FowlerLandingPage />);

    const browseRefactorings = screen.getByRole("link", { name: /browse all refactorings/i });
    expect(browseRefactorings).toHaveAttribute("href", "/refactoring/refactorings");

    const browseSmells = screen.getByRole("link", { name: /browse all smells/i });
    expect(browseSmells).toHaveAttribute("href", "/refactoring/smells");
  });
});
