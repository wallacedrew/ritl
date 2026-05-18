import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SmellComparePage from "@/smells/SmellComparePage";

describe("user reads the compare view of a smell", () => {
  it("sees both lens contents side-by-side at /smells/mysterious-name/compare", async () => {
    const ui = await SmellComparePage({
      params: Promise.resolve({ slug: "mysterious-name" }),
    });

    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Mysterious Name", level: 1 })).toBeInTheDocument();

    expect(screen.getAllByText("Human").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Agent").length).toBeGreaterThan(0);

    // Human-lens content (existing migrated prose)
    expect(screen.getByText(/identifiers that don.{0,3}t reveal intent/i)).toBeInTheDocument();

    // Agent-lens content (authored in batch 1 of the smell content sprint)
    expect(screen.getByText(/token-level identifiers/i)).toBeInTheDocument();

    // Cross-lens nav: Human and Agent are links; Compare is plain text (current view)
    const toHuman = screen.getByRole("link", { name: "Human" });
    expect(toHuman).toHaveAttribute("href", "/smells/mysterious-name");

    const toAgent = screen.getByRole("link", { name: "Agent" });
    expect(toAgent).toHaveAttribute("href", "/smells/mysterious-name/agent");
  });
});
