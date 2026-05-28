import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import GofLandingPage from "@/design-patterns/GofLandingPage";
import PatternsDetailPage from "@/patterns/PatternsDetailPage";

describe("user reads Abstract Factory via the GoF sub-site", () => {
  it("GoF landing lists Abstract Factory as a browseable entry under /design-patterns", () => {
    renderWithTheme(<GofLandingPage />);

    const abstractFactoryLinks = screen.getAllByRole("link", { name: /Abstract Factory/i });
    expect(abstractFactoryLinks[0]).toHaveAttribute("href", "/design-patterns/abstract-factory");
  });

  it("Abstract Factory detail renders with the family-of-products before/after and back-links to /design-patterns", async () => {
    const ui = await PatternsDetailPage({
      params: Promise.resolve({ slug: "abstract-factory" }),
      book: "gof",
    });
    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Abstract Factory", level: 1 })).toBeInTheDocument();

    expect(screen.getByText(/LightWidgetFactory/)).toBeInTheDocument();
    expect(screen.getByText(/DarkWidgetFactory/)).toBeInTheDocument();

    const shotgunSurgeryLink = screen.getByRole("link", { name: "Shotgun Surgery" });
    expect(shotgunSurgeryLink).toHaveAttribute("href", "/refactoring/smells/shotgun-surgery");

    const factoryFunctionLink = screen.getByRole("link", {
      name: "Replace Constructor with Factory Function",
    });
    expect(factoryFunctionLink).toHaveAttribute(
      "href",
      "/refactoring/refactorings/replace-constructor-with-factory-function",
    );

    const backLink = screen.getByRole("link", { name: /Patterns/i });
    expect(backLink).toHaveAttribute("href", "/design-patterns");

    expect(screen.getByText(/Gamma, Helm, Johnson, Vlissides/i)).toBeInTheDocument();
  });
});
