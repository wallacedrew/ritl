import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SmellAgentPage from "@/smells/SmellAgentPage";

describe("user reads the agent view of a smell", () => {
  it("renders authored agent-lens content at /smells/mysterious-name/agent", async () => {
    const ui = await SmellAgentPage({
      params: Promise.resolve({ slug: "mysterious-name" }),
    });

    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Mysterious Name", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/token-level identifiers/i)).toBeInTheDocument();
    expect(screen.getByText(/per-occurrence reading cost/i)).toBeInTheDocument();

    const backToHuman = screen.getByRole("link", { name: "Human" });
    expect(backToHuman).toHaveAttribute("href", "/refactoring/smells/mysterious-name");

    const toCompare = screen.getByRole("link", { name: "Compare" });
    expect(toCompare).toHaveAttribute("href", "/refactoring/smells/mysterious-name/compare");
  });
});
