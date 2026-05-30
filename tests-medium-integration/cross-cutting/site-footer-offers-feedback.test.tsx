import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SiteFooter from "@/shared/components/SiteFooter";

describe("site footer offers attribution and feedback", () => {
  it("carries the catalog-explorer attribution that used to live in the header", () => {
    renderWithTheme(<SiteFooter />);

    expect(screen.getByText(/A catalog explorer inspired by Martin Fowler/i)).toBeInTheDocument();
  });

  it("links to the project's feedback inbox via mailto", () => {
    renderWithTheme(<SiteFooter />);

    const feedbackLink = screen.getByRole("link", { name: /feedback/i });
    expect(feedbackLink).toHaveAttribute("href", "mailto:feedback@refactoringintheloop.com");
  });

  it("names the author and links the GitHub source + ADR-0006", () => {
    renderWithTheme(<SiteFooter />);

    expect(screen.getByText(/Built by Wallace Drew/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "github.com/wallacedrew/ritl" })).toHaveAttribute(
      "href",
      "https://github.com/wallacedrew/ritl",
    );
    expect(screen.getByRole("link", { name: "ADR-0006" })).toHaveAttribute(
      "href",
      "https://github.com/wallacedrew/ritl/blob/main/docs/architecture/0006-agent-forces-carry-the-contrast.md",
    );
  });
});
