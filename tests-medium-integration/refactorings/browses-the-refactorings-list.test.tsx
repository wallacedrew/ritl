import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringsPage from "@/refactorings/RefactoringsPage";

describe("user browses the refactorings list", () => {
  it("sees Extract Function with the smells it solves on /refactorings", () => {
    renderWithTheme(<RefactoringsPage />);

    expect(screen.getByRole("heading", { name: "Extract Function" })).toBeInTheDocument();
    expect(screen.getAllByText("Long Function").length).toBeGreaterThanOrEqual(1);

    const downloadLink = screen.getByRole("link", { name: /snippets for AGENTS\.md/i });
    expect(downloadLink).toHaveAttribute("href", "/snippets/refactorings.md");
    expect(downloadLink).toHaveAttribute("download");
  });
});
