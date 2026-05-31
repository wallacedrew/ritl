import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import GofLandingPage from "@/patterns/GofLandingPage";
import HomePage from "@/home/HomePage";

describe("user reaches the GoF Design Patterns sub-site", () => {
  it("home page offers a Design Patterns card linking to /design-patterns", () => {
    renderWithTheme(<HomePage />);

    const gofCardLink = screen.getByRole("link", { name: "Design Patterns" });
    expect(gofCardLink).toHaveAttribute("href", "/design-patterns");
  });

  it("GoF landing renders the source attribution to Gamma, Helm, Johnson, Vlissides", () => {
    renderWithTheme(<GofLandingPage />);

    expect(
      screen.getByText(/Gamma, Helm, Johnson, Vlissides.*Design Patterns/i),
    ).toBeInTheDocument();
  });

  it("GoF landing describes the catalog as the 23 canonical patterns across the three GoF bands", () => {
    renderWithTheme(<GofLandingPage />);

    expect(
      screen.getByText(
        /23 canonical Gang of Four design patterns.*Creational.*Structural.*Behavioral/i,
      ),
    ).toBeInTheDocument();
  });
});
