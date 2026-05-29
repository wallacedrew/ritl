import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithCatalogGraph } from "../../tests-small-unit/_helpers/renderWithCatalogGraph";
import SmellDetailPage from "@/smells/SmellDetailPage";

describe("user drills three levels deep via the chevron without losing chevrons", () => {
  it("renders chevrons on chips inside a popover inside a popover", async () => {
    const user = userEvent.setup();
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "long-function" }),
    });
    renderWithCatalogGraph(ui);

    // Level 1 — open the chevron next to Extract Function on the Long Function smell detail.
    const extractFunctionChevron = screen.getAllByRole("button", {
      name: /Extract Function cross-references/i,
    })[0];
    if (!extractFunctionChevron) throw new Error("no Extract Function chevron rendered");
    await user.click(extractFunctionChevron);

    const firstPanel = await screen.findByRole("dialog", {
      name: /Extract Function cross-references/i,
    });

    // Level 2 — inside the Extract Function popover, find the Long Function chip's own
    // chevron and open it. The chip is the one we came from; the recursive resolver
    // should still produce a chevron because Long Function has its own connections.
    const longFunctionChevron = within(firstPanel).getByRole("button", {
      name: /Long Function cross-references/i,
    });
    await user.click(longFunctionChevron);

    const secondPanel = await screen.findByRole("dialog", {
      name: /Long Function cross-references/i,
    });

    // Level 3 — inside the Long Function popover, the Replace Temp with Query chip
    // must also expose its own chevron (no depth limit). Open it and confirm the
    // third popover renders.
    const replaceTempChevron = within(secondPanel).getByRole("button", {
      name: /Replace Temp with Query cross-references/i,
    });
    await user.click(replaceTempChevron);

    const thirdPanel = await screen.findByRole("dialog", {
      name: /Replace Temp with Query cross-references/i,
    });
    expect(within(thirdPanel).getByText(/Removes smells/i)).toBeInTheDocument();
  });
});
