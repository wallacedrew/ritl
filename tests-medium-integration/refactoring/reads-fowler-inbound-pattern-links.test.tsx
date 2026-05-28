import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";
import SmellDetailPage from "@/smells/SmellDetailPage";

describe("Fowler detail pages surface inbound pattern references", () => {
  it("refactoring 'Replace Conditional with Polymorphism' shows patterns that reference it", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "replace-conditional-with-polymorphism" }),
    });
    renderWithTheme(ui);

    expect(screen.getByText(/Referenced by patterns/i)).toBeInTheDocument();

    const strategyGof = screen.getAllByRole("link", { name: "Strategy" });
    expect(
      strategyGof.some((link) => link.getAttribute("href") === "/design-patterns/strategy"),
    ).toBe(true);

    const factoryMethod = screen.getAllByRole("link", { name: "Factory Method" });
    expect(
      factoryMethod.some((link) => link.getAttribute("href") === "/design-patterns/factory-method"),
    ).toBe(true);
  });

  it("smell 'Shotgun Surgery' shows GoF + Kerievsky patterns that reference it", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "shotgun-surgery" }),
    });
    renderWithTheme(ui);

    expect(screen.getByText(/Referenced by patterns/i)).toBeInTheDocument();

    const abstractFactory = screen.getAllByRole("link", { name: "Abstract Factory" });
    expect(
      abstractFactory.some(
        (link) => link.getAttribute("href") === "/design-patterns/abstract-factory",
      ),
    ).toBe(true);
  });
});
