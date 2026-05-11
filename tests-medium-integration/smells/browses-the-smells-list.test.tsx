import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SmellsPage from "@/smells/SmellsPage";

describe("user browses the smells list", () => {
  it("sees the Mysterious Name smell with its symptom on /smells", () => {
    renderWithTheme(<SmellsPage />);

    expect(screen.getByRole("heading", { name: "Mysterious Name" })).toBeInTheDocument();
    expect(screen.getByText(/identifiers that don.{0,3}t reveal intent/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /smells\.md/i })).toBeInTheDocument();
  });
});
