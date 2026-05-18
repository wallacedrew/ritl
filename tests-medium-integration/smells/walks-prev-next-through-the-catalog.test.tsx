import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import SmellDetailPage from "@/smells/SmellDetailPage";

// Each detail page renders prev/next twice — once as a slim text-link strip
// at the top (CatalogPrevNextStrip) and once as preview tiles at the bottom
// (CatalogPrevNext). These tests assert all surfaces point at the same
// neighbor.
describe("user walks the smells catalog with prev/next links", () => {
  it("on the first smell, shows Next only", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "mysterious-name" }),
    });

    renderWithTheme(ui);

    expect(screen.queryAllByRole("link", { name: /^previous/i })).toHaveLength(0);
    const nextLinks = screen.getAllByRole("link", { name: /next/i });
    expect(nextLinks.length).toBeGreaterThan(0);
    nextLinks.forEach((link) => expect(link).toHaveAttribute("href", "/smells/duplicated-code"));
  });

  it("on a middle smell, shows both Prev and Next pointing to neighbors", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "long-function" }),
    });

    renderWithTheme(ui);

    const prevLinks = screen.getAllByRole("link", { name: /previous/i });
    const nextLinks = screen.getAllByRole("link", { name: /next/i });
    prevLinks.forEach((link) => expect(link).toHaveAttribute("href", "/smells/duplicated-code"));
    nextLinks.forEach((link) =>
      expect(link).toHaveAttribute("href", "/smells/long-parameter-list"),
    );
  });

  it("on the last smell, shows Previous only", async () => {
    const ui = await SmellDetailPage({
      params: Promise.resolve({ slug: "comments" }),
    });

    renderWithTheme(ui);

    expect(screen.queryAllByRole("link", { name: /^next/i })).toHaveLength(0);
    expect(screen.getAllByRole("link", { name: /previous/i }).length).toBeGreaterThan(0);
  });
});
