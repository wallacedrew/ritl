import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithCatalogGraph } from "../../tests-small-unit/_helpers/renderWithCatalogGraph";
import SmellDetailPage from "@/smells/SmellDetailPage";

describe("user explores cross-references from a chip on a detail page", () => {
  it("renders a chevron next to each chip inside the smell's 'Apply refactorings' row", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "long-function" }),
    });
    renderWithCatalogGraph(ui);

    const toggles = screen.getAllByRole("button", {
      name: /Extract Function cross-references/i,
    });
    expect(toggles.length).toBeGreaterThan(0);
  });

  it("opens a popover with Extract Function's connected entries when the chevron is clicked", async () => {
    const user = userEvent.setup();
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "long-function" }),
    });
    renderWithCatalogGraph(ui);

    const toggles = screen.getAllByRole("button", {
      name: /Extract Function cross-references/i,
    });
    const toggle = toggles[0];
    if (!toggle) throw new Error("no chevron rendered for Extract Function");
    await user.click(toggle);

    const panel = await screen.findByRole("dialog", {
      name: /Extract Function cross-references/i,
    });
    expect(within(panel).getByText(/Removes smells/i)).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: "Long Function" })).toBeInTheDocument();
  });
});
