import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SmellsPage from "@/smells/SmellsPage";

describe("user browses the smells list", () => {
  it("sees the Mysterious Name smell with its symptom on /smells", () => {
    renderWithTheme(<SmellsPage />);

    expect(screen.getByRole("link", { name: "Mysterious Name" })).toHaveAttribute(
      "href",
      "/refactoring/smells/mysterious-name",
    );
    expect(screen.getByText(/identifiers that don.{0,3}t reveal intent/i)).toBeInTheDocument();
  });
});
