import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import AtlasView from "@/reference/atlas/AtlasView";

describe("user views the atlas of the catalog at /reference/atlas", () => {
  it("renders a single SVG canvas with column headings for each catalog layer", () => {
    renderWithTheme(<AtlasView />);

    const atlas = screen.getByRole("img", { name: /catalog atlas/i });
    expect(atlas.tagName.toLowerCase()).toBe("svg");
    expect(within(atlas).getByText(/^Smells$/)).toBeInTheDocument();
    expect(within(atlas).getByText(/^Refactorings$/)).toBeInTheDocument();
    expect(within(atlas).getByText(/^Refactoring to Patterns$/)).toBeInTheDocument();
    expect(within(atlas).getByText(/^Design Patterns$/)).toBeInTheDocument();
  });

  it("places known entries inside their layer columns", () => {
    renderWithTheme(<AtlasView />);

    const atlas = screen.getByRole("img", { name: /catalog atlas/i });
    expect(within(atlas).getByText("Long Function")).toBeInTheDocument();
    expect(within(atlas).getByText("Extract Function")).toBeInTheDocument();
    expect(within(atlas).getByText("Encapsulate Classes With Factory")).toBeInTheDocument();
    expect(within(atlas).getByText("Factory Method")).toBeInTheDocument();
  });

  it("draws at least one edge path connecting nodes across layers", () => {
    const { container } = renderWithTheme(<AtlasView />);

    const atlas = container.querySelector('svg[aria-label="catalog atlas"]');
    expect(atlas).not.toBeNull();
    const edges = atlas?.querySelectorAll("path[data-atlas-edge]");
    expect(edges?.length ?? 0).toBeGreaterThan(0);
  });

  it("draws the Encapsulate Classes With Factory → Factory Method destination edge", () => {
    const { container } = renderWithTheme(<AtlasView />);

    const atlas = container.querySelector('svg[aria-label="catalog atlas"]');
    const destinationEdge = atlas?.querySelector(
      'path[data-atlas-edge][data-source-id="kerievsky-pattern:encapsulate-classes-with-factory"][data-target-id="gof-pattern:factory-method"]',
    );
    expect(destinationEdge).not.toBeNull();
  });
});
