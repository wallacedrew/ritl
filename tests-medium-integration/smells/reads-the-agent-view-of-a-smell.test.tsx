import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SmellAgentPage from "@/smells/SmellAgentPage";

describe("user reads the agent view of a smell", () => {
  it("falls back to human-lens content at /smells/mysterious-name/agent when agent forces are not yet authored", async () => {
    const ui = await SmellAgentPage({
      params: Promise.resolve({ slug: "mysterious-name" }),
    });

    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Mysterious Name", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/identifiers that don.{0,3}t reveal intent/i)).toBeInTheDocument();
    expect(screen.getByText(/re-comprehension cost/i)).toBeInTheDocument();

    const backToHuman = screen.getByRole("link", { name: /View as human/ });
    expect(backToHuman).toHaveAttribute("href", "/smells/mysterious-name");
  });
});
