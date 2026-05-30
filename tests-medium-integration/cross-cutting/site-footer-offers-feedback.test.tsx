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
});
