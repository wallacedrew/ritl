import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SmellDetailPage from "@/smells/SmellDetailPage";

describe("user reads a smell detail", () => {
  it("sees Mysterious Name's full content at /smells/mysterious-name", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "mysterious-name" }),
    });

    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Mysterious Name", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/identifiers that don.{0,3}t reveal intent/i)).toBeInTheDocument();
    expect(screen.getByText(/re-comprehension cost/i)).toBeInTheDocument();
    expect(screen.getByText(/names read as the domain/i)).toBeInTheDocument();
    expect(screen.getByText(/onboarding time/i)).toBeInTheDocument();
    expect(screen.getByText(/function calc/)).toBeInTheDocument();
    expect(screen.getByText(/function distance/)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /preview snippet for AGENTS\.md/i }),
    ).toBeInTheDocument();
  });
});
