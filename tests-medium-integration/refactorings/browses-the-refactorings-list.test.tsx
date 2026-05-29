import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithCatalogGraph } from "../../tests-small-unit/_helpers/renderWithCatalogGraph";
import RefactoringsPage from "@/refactorings/RefactoringsPage";

describe("user browses the refactorings list", () => {
  it("sees Extract Function on /refactorings with a chevron that peeks at the smells it removes", () => {
    renderWithCatalogGraph(<RefactoringsPage />);

    expect(screen.getByRole("link", { name: "Extract Function" })).toHaveAttribute(
      "href",
      "/refactoring/canon/extract-function",
    );
    expect(
      screen.getByRole("button", { name: /Extract Function cross-references/i }),
    ).toBeInTheDocument();
  });
});
