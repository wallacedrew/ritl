import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";

describe("user reads a refactoring detail with smell cross-links", () => {
  it("sees Extract Function's full content with linked solves at /refactorings/extract-function", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "extract-function" }),
    });

    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Extract Function", level: 1 })).toBeInTheDocument();

    const longFunctionLink = screen.getByRole("link", { name: "Long Function" });
    expect(longFunctionLink).toHaveAttribute("href", "/smells/long-function");

    const duplicatedCodeLink = screen.getByRole("link", { name: "Duplicated Code" });
    expect(duplicatedCodeLink).toHaveAttribute("href", "/smells/duplicated-code");

    expect(screen.getByText(/maze of one-line functions/i)).toBeInTheDocument();
    expect(screen.getByText(/single named domain step/i)).toBeInTheDocument();
    expect(screen.getByText(/named subroutines/i)).toBeInTheDocument();
    expect(screen.getByText(/missing id/)).toBeInTheDocument();
    expect(screen.getByText(/withTax/)).toBeInTheDocument();

    const downloadLink = screen.getByRole("link", { name: /snippet for AGENTS\.md/i });
    expect(downloadLink).toHaveAttribute("href", "/snippets/refactorings/extract-function.md");
    expect(downloadLink).toHaveAttribute("download");
  });
});
