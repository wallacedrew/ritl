import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import NotFound from "@/app/not-found";

describe("user lands on an unknown URL", () => {
  it("frames the missing page as a Mysterious URL", () => {
    renderWithTheme(<NotFound />);

    expect(screen.getByRole("heading", { level: 1, name: /Mysterious URL/i })).toBeInTheDocument();
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByText(/reveal its intent/i)).toBeInTheDocument();
  });

  it("offers three browse routes back into the catalog", () => {
    renderWithTheme(<NotFound />);

    const browseRefactorings = screen.getByRole("link", { name: /Browse refactorings/i });
    const browseSmells = screen.getByRole("link", { name: /Browse smells/i });
    const browseReference = screen.getByRole("link", { name: /Reference/i });

    expect(browseRefactorings).toHaveAttribute("href", "/");
    expect(browseSmells).toHaveAttribute("href", "/smells");
    expect(browseReference).toHaveAttribute("href", "/reference");
  });

  it("suggests three starter catalog entries with working detail links", () => {
    renderWithTheme(<NotFound />);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("/refactorings/extract-function");
    expect(hrefs).toContain("/refactorings/rename-variable");
    expect(hrefs).toContain("/smells/long-function");
  });
});
