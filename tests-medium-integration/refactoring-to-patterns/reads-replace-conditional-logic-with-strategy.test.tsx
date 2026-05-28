import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import KerievskyLandingPage from "@/refactoring-to-patterns/KerievskyLandingPage";
import PatternsDetailPage from "@/patterns/PatternsDetailPage";

describe("user reads Replace Conditional Logic with Strategy", () => {
  it("Kerievsky landing browseably lists the new pattern alongside Compose Method", () => {
    renderWithTheme(<KerievskyLandingPage />);

    const composeLinks = screen.getAllByRole("link", { name: /Compose Method/i });
    expect(composeLinks[0]).toHaveAttribute("href", "/refactoring-to-patterns/compose-method");

    const strategyLinks = screen.getAllByRole("link", {
      name: /Replace Conditional Logic with Strategy/i,
    });
    expect(strategyLinks[0]).toHaveAttribute(
      "href",
      "/refactoring-to-patterns/replace-conditional-logic-with-strategy",
    );
  });

  it("detail page renders the loan-calculator before/after with cross-sub-site nemesis links", async () => {
    const ui = await PatternsDetailPage({
      params: Promise.resolve({ slug: "replace-conditional-logic-with-strategy" }),
      book: "kerievsky",
    });
    renderWithTheme(ui);

    expect(
      screen.getByRole("heading", { name: "Replace Conditional Logic with Strategy", level: 1 }),
    ).toBeInTheDocument();

    expect(screen.getByText(/capitalStrategy/)).toBeInTheDocument();
    expect(screen.getByText(/TermLoanStrategy/)).toBeInTheDocument();

    const repeatedSwitchesLink = screen.getByRole("link", { name: "Repeated Switches" });
    expect(repeatedSwitchesLink).toHaveAttribute("href", "/refactoring/smells/repeated-switches");

    const polymorphismLink = screen.getByRole("link", {
      name: "Replace Conditional with Polymorphism",
    });
    expect(polymorphismLink).toHaveAttribute(
      "href",
      "/refactoring/refactorings/replace-conditional-with-polymorphism",
    );

    expect(screen.getByText(/Adapted from Joshua Kerievsky/i)).toBeInTheDocument();
  });

  it("detail page surfaces the GoF destination as a Strategy chip linking to /design-patterns/strategy", async () => {
    const ui = await PatternsDetailPage({
      params: Promise.resolve({ slug: "replace-conditional-logic-with-strategy" }),
      book: "kerievsky",
    });
    renderWithTheme(ui);

    expect(screen.getByText(/Destination/i)).toBeInTheDocument();

    const destinationChips = screen.getAllByRole("link", { name: "Strategy" });
    const gofLink = destinationChips.find(
      (chip) => chip.getAttribute("href") === "/design-patterns/strategy",
    );
    expect(gofLink).toBeDefined();
  });
});
