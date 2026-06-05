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
    expect(longFunctionLink).toHaveAttribute("href", "/refactoring/smells/long-function");

    const duplicatedCodeLink = screen.getByRole("link", { name: "Duplicated Code" });
    expect(duplicatedCodeLink).toHaveAttribute("href", "/refactoring/smells/duplicated-code");

    expect(screen.getByText(/fan-out of one-line functions/i)).toBeInTheDocument();
    expect(screen.getByText(/single named domain step/i)).toBeInTheDocument();
    expect(screen.getByText(/named subroutines/i)).toBeInTheDocument();
    // Code is rendered through prism-react-renderer which tokenizes into
    // many sibling <span> nodes, so getByText can't find multi-token
    // substrings. Search the rendered text content directly.
    expect(document.body.textContent).toContain("let total = 0");
    expect(document.body.textContent).toContain("subtotalAfterBulkDiscount");

    expect(screen.getByRole("button", { name: /preview Markdown/i })).toBeInTheDocument();

    const viewAsAgentLink = screen.getByRole("link", { name: "Agent" });
    expect(viewAsAgentLink).toHaveAttribute("href", "/refactoring/canon/extract-function/agent");

    const viewAsCompareLink = screen.getByRole("link", { name: "Compare" });
    expect(viewAsCompareLink).toHaveAttribute(
      "href",
      "/refactoring/canon/extract-function/compare",
    );
  });
});
