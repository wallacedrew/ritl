import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SmellDetailPage from "@/smells/SmellDetailPage";

describe("user navigates back from a smell detail", () => {
  it("shows a back-link to the smells index above the entry header", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "long-function" }),
    });

    renderWithTheme(ui);

    const backLink = screen.getByRole("link", { name: /smells/i });
    expect(backLink).toHaveAttribute("href", "/refactoring/smells");
  });
});
