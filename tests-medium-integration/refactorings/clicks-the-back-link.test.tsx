import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";

describe("user navigates back from a refactoring detail", () => {
  it("shows a back-link to the refactorings index above the entry header", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "extract-function" }),
    });

    renderWithTheme(ui);

    const backLink = screen.getByRole("link", { name: /refactorings/i });
    expect(backLink).toHaveAttribute("href", "/");
  });
});
