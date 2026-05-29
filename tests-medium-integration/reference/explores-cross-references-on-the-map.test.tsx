import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithCatalogGraph } from "../../tests-small-unit/_helpers/renderWithCatalogGraph";
import CatalogMapView from "@/reference/map/CatalogMapView";

describe("user opens a cross-reference popover from a chip on the catalog map", () => {
  it("renders a chevron beside the Encapsulate Classes With Factory source chip", () => {
    renderWithCatalogGraph(<CatalogMapView />);

    const toggles = screen.getAllByRole("button", {
      name: /Encapsulate Classes With Factory cross-references/i,
    });
    expect(toggles.length).toBeGreaterThan(0);
  });

  it("opens a popover with the Destination group when the chevron is clicked", async () => {
    const user = userEvent.setup();
    renderWithCatalogGraph(<CatalogMapView />);

    const toggles = screen.getAllByRole("button", {
      name: /Encapsulate Classes With Factory cross-references/i,
    });
    const toggle = toggles[0];
    if (!toggle) throw new Error("no chevron toggle rendered");
    await user.click(toggle);

    const panel = await screen.findByRole("dialog", {
      name: /Encapsulate Classes With Factory cross-references/i,
    });
    expect(within(panel).getByText(/Destination/i)).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: "Factory Method" })).toHaveAttribute(
      "href",
      "/design-patterns/factory-method",
    );
  });
});
