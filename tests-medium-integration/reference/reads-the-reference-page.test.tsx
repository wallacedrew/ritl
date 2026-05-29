import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import ReferencePage from "@/reference/ReferencePage";

describe("user reads the combined reference page at /reference", () => {
  it("shows a section heading for each of the four catalogs", () => {
    renderWithTheme(<ReferencePage />);

    expect(screen.getByRole("heading", { name: /^Refactorings$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Code smells$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Refactoring to Patterns$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Design Patterns$/i })).toBeInTheDocument();
  });

  it("groups refactorings by Fowler chapter and links each chip to its detail page", () => {
    renderWithTheme(<ReferencePage />);

    expect(screen.getByRole("heading", { name: /Composing Methods/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Simplifying Conditional Logic/i }),
    ).toBeInTheDocument();

    const extractFunctionLinks = screen.getAllByRole("link", { name: "Extract Function" });
    expect(extractFunctionLinks[0]).toHaveAttribute("href", "/refactoring/canon/extract-function");
  });

  it("groups Gang of Four patterns by Creational / Structural / Behavioral", () => {
    renderWithTheme(<ReferencePage />);

    expect(screen.getByRole("heading", { name: /^Creational$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Structural$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Behavioral$/i })).toBeInTheDocument();
  });

  it("renders Kerievsky pattern chips that link into the /refactoring-to-patterns sub-site", () => {
    renderWithTheme(<ReferencePage />);

    const composeMethodLinks = screen.getAllByRole("link", { name: "Compose Method" });
    expect(composeMethodLinks[0]).toHaveAttribute(
      "href",
      "/refactoring-to-patterns/compose-method",
    );
  });

  it("renders GoF pattern chips that link into the /design-patterns sub-site", () => {
    renderWithTheme(<ReferencePage />);

    const compositeLinks = screen.getAllByRole("link", { name: "Composite" });
    expect(compositeLinks[0]).toHaveAttribute("href", "/design-patterns/composite");
  });

  it("renders smell chips that link into /refactoring/smells/:slug", () => {
    renderWithTheme(<ReferencePage />);

    const longFunctionLinks = screen.getAllByRole("link", { name: "Long Function" });
    expect(longFunctionLinks[0]).toHaveAttribute("href", "/refactoring/smells/long-function");
  });
});
