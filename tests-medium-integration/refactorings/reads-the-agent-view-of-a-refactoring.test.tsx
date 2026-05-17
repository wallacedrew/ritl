import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringAgentPage from "@/refactorings/RefactoringAgentPage";

describe("user reads the agent view of a refactoring", () => {
  it("sees Extract Function rendered with agent-lens labels at /refactorings/extract-function/agent", async () => {
    const ui = await RefactoringAgentPage({
      params: Promise.resolve({ slug: "extract-function" }),
    });

    renderWithTheme(ui);

    expect(
      screen.getByRole("heading", { name: /Apply: 01 — Extract Function/, level: 1 }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Apply Extract Function when you see/)).toBeInTheDocument();
    expect(screen.getByText(/Target state/)).toBeInTheDocument();
    expect(screen.getByText(/Why apply it/)).toBeInTheDocument();
    expect(screen.getByText(/Pitfall/)).toBeInTheDocument();
    expect(screen.getByText(/Removes smells/)).toBeInTheDocument();

    expect(screen.queryByText(/^Goal$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Savings$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Tradeoff$/)).not.toBeInTheDocument();

    const backToHuman = screen.getByRole("link", { name: /View as human/ });
    expect(backToHuman).toHaveAttribute("href", "/refactorings/extract-function");
  });
});
