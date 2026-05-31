import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import GofLandingPage from "@/design-patterns/GofLandingPage";
import PatternsDetailPage from "@/design-patterns/PatternsDetailPage";

describe("user reads Abstract Factory via the GoF sub-site", () => {
  it("GoF landing lists Abstract Factory as a browseable entry under /design-patterns", () => {
    renderWithTheme(<GofLandingPage />);

    const abstractFactoryLinks = screen.getAllByRole("link", { name: /Abstract Factory/i });
    expect(abstractFactoryLinks[0]).toHaveAttribute("href", "/design-patterns/abstract-factory");
  });

  it("Abstract Factory detail renders with the family-of-products before/after and back-links to /design-patterns", async () => {
    const ui = await PatternsDetailPage({
      params: Promise.resolve({ slug: "abstract-factory" }),
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
      "/refactoring/canon/replace-constructor-with-factory-function",
    );

    const backLink = screen.getByRole("link", { name: /Patterns/i });
    expect(backLink).toHaveAttribute("href", "/design-patterns");

    expect(screen.getByText(/Gamma, Helm, Johnson, Vlissides/i)).toBeInTheDocument();
  });

  it("Composite detail surfaces 'Reached from' inverse links to the three Kerievsky composite refactorings", async () => {
    const ui = await PatternsDetailPage({
      params: Promise.resolve({ slug: "composite" }),
    });
    renderWithTheme(ui);

    expect(screen.getByText(/Reached from/i)).toBeInTheDocument();

    const extractComposite = screen.getByRole("link", { name: "Extract Composite" });
    expect(extractComposite).toHaveAttribute("href", "/refactoring-to-patterns/extract-composite");

    const implicitTree = screen.getByRole("link", { name: "Replace Implicit Tree With Composite" });
    expect(implicitTree).toHaveAttribute(
      "href",
      "/refactoring-to-patterns/replace-implicit-tree-with-composite",
    );

    const oneMany = screen.getByRole("link", {
      name: "Replace One/Many Distinctions With Composite",
    });
    expect(oneMany).toHaveAttribute(
      "href",
      "/refactoring-to-patterns/replace-onemany-distinctions-with-composite",
    );
  });
});
