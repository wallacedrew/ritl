import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import HomePage from "@/home/HomePage";

describe("user reads the reference view at the home page", () => {
  it("shows catalog stats — 24 smells, 66 refactorings", () => {
    renderWithTheme(<HomePage />);

    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("66")).toBeInTheDocument();
    expect(screen.getAllByText(/smells/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/refactorings/i).length).toBeGreaterThanOrEqual(1);
  });

  it("shows refactorings grouped by Fowler category, each chip links to the refactoring detail", () => {
    renderWithTheme(<HomePage />);

    expect(screen.getByRole("heading", { name: /Composing Methods/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Inheritance/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Simplifying Conditional Logic/i }),
    ).toBeInTheDocument();

    const extractFunctionLinks = screen.getAllByRole("link", { name: "Extract Function" });
    expect(extractFunctionLinks[0]).toHaveAttribute("href", "/refactorings/extract-function");
  });
});
