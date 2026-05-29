import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import CatalogMapView from "@/reference/map/CatalogMapView";

describe("user views the catalog map at /reference/map", () => {
  it("renders the four section headings", () => {
    renderWithTheme(<CatalogMapView />);

    expect(screen.getByRole("heading", { name: /Cross-book bridges/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Patterns without a destination/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Sparsest cross-references/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Most-connected entries/i })).toBeInTheDocument();
  });

  it("lists a known Kerievsky → GoF bridge under Cross-book bridges", () => {
    renderWithTheme(<CatalogMapView />);

    const section = screen.getByRole("heading", { name: /Cross-book bridges/i }).closest("section");
    expect(section).not.toBeNull();
    if (!section) return;
    expect(
      within(section).getByRole("link", { name: "Encapsulate Classes With Factory" }),
    ).toHaveAttribute("href", "/refactoring-to-patterns/encapsulate-classes-with-factory");
    // Factory Method is the destination of multiple Kerievsky journeys; expect at least one
    // link, pointing at its detail page.
    const factoryMethodLinks = within(section).getAllByRole("link", { name: "Factory Method" });
    expect(factoryMethodLinks.length).toBeGreaterThanOrEqual(1);
    expect(factoryMethodLinks[0]).toHaveAttribute("href", "/design-patterns/factory-method");
  });

  it("lists Compose Method under 'Patterns without a destination'", () => {
    renderWithTheme(<CatalogMapView />);

    const section = screen
      .getByRole("heading", { name: /Patterns without a destination/i })
      .closest("section");
    expect(section).not.toBeNull();
    if (!section) return;
    expect(within(section).getByRole("link", { name: "Compose Method" })).toHaveAttribute(
      "href",
      "/refactoring-to-patterns/compose-method",
    );
  });

  it("ranks Most-connected entries by total connection count", () => {
    renderWithTheme(<CatalogMapView />);

    const section = screen
      .getByRole("heading", { name: /Most-connected entries/i })
      .closest("section");
    expect(section).not.toBeNull();
    if (!section) return;
    // Long Function has 9 outbound nemeses + multiple inbound — should be in the top list.
    expect(within(section).getByRole("link", { name: "Long Function" })).toBeInTheDocument();
  });
});
