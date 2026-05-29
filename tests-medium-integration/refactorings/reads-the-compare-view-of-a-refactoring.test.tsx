import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringComparePage from "@/refactorings/RefactoringComparePage";

describe("user reads the compare view of a refactoring", () => {
  it("sees both lens contents side-by-side at /refactorings/extract-function/compare", async () => {
    const ui = await RefactoringComparePage({
      params: Promise.resolve({ slug: "extract-function" }),
    });

    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Extract Function", level: 1 })).toBeInTheDocument();

    // Each force section has Human + Agent sub-labels per pair
    expect(screen.getAllByText("Human").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Agent").length).toBeGreaterThan(0);

    // Human-lens content (from the authored prose)
    expect(screen.getByText(/mental outline before you can read it/i)).toBeInTheDocument();

    // Agent-lens content (from the authored prose)
    expect(screen.getByText(/chunk-reasoning budget/i)).toBeInTheDocument();

    // Cross-lens nav: Human and Agent are links; Compare is plain text (current view)
    const toHuman = screen.getByRole("link", { name: "Human" });
    expect(toHuman).toHaveAttribute("href", "/refactoring/canon/extract-function");

    const toAgent = screen.getByRole("link", { name: "Agent" });
    expect(toAgent).toHaveAttribute("href", "/refactoring/canon/extract-function/agent");
  });
});
