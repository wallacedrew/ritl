import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringAgentPage from "@/refactorings/RefactoringAgentPage";

describe("user reads the agent view of a refactoring", () => {
  it("renders Extract Function at /refactorings/extract-function/agent with the same L&F as the human view + cross-lens link back", async () => {
    const ui = await RefactoringAgentPage({
      params: Promise.resolve({ slug: "extract-function" }),
    });

    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Extract Function", level: 1 })).toBeInTheDocument();

    // Same labels as human view (per the locked decision: same L&F + same labels in both views)
    expect(screen.getByText(/^Goal$/)).toBeInTheDocument();
    expect(screen.getByText(/^Pressure$/)).toBeInTheDocument();
    expect(screen.getByText(/^Tradeoff$/)).toBeInTheDocument();
    expect(screen.getByText(/^Relief$/)).toBeInTheDocument();
    expect(screen.getByText(/^Trap$/)).toBeInTheDocument();

    // Cross-lens nav: links to human + compare; current view (Agent) is plain text
    const backToHuman = screen.getByRole("link", { name: "Human" });
    expect(backToHuman).toHaveAttribute("href", "/refactoring/refactorings/extract-function");

    const toCompare = screen.getByRole("link", { name: "Compare" });
    expect(toCompare).toHaveAttribute("href", "/refactoring/refactorings/extract-function/compare");
  });
});
