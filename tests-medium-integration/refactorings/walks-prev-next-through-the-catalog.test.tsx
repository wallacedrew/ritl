import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";

// Each detail page renders prev/next twice — once as a slim text-link strip
// at the top (CatalogPrevNextStrip) and once as preview tiles at the bottom
// (CatalogPrevNext). These tests assert both surfaces point at the same
// neighbor and reduce to the same neighbor count.
describe("user walks the refactorings catalog with prev/next links", () => {
  it("on the first refactoring, shows Next only", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "extract-function" }),
    });

    renderWithTheme(ui);

    expect(screen.queryAllByRole("link", { name: /^previous/i })).toHaveLength(0);
    const nextLinks = screen.getAllByRole("link", { name: /next/i });
    expect(nextLinks.length).toBeGreaterThan(0);
    nextLinks.forEach((link) =>
      expect(link).toHaveAttribute("href", "/refactoring/canon/inline-function"),
    );
  });

  it("on a middle refactoring, shows both Prev and Next pointing to neighbors", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "change-function-declaration" }),
    });

    renderWithTheme(ui);

    const prevLinks = screen.getAllByRole("link", { name: /previous/i });
    const nextLinks = screen.getAllByRole("link", { name: /next/i });
    prevLinks.forEach((link) =>
      expect(link).toHaveAttribute("href", "/refactoring/canon/inline-variable"),
    );
    nextLinks.forEach((link) =>
      expect(link).toHaveAttribute("href", "/refactoring/canon/encapsulate-variable"),
    );
  });

  it("on the last refactoring, shows Previous only", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "replace-superclass-with-delegate" }),
    });

    renderWithTheme(ui);

    expect(screen.queryAllByRole("link", { name: /^next/i })).toHaveLength(0);
    expect(screen.getAllByRole("link", { name: /previous/i }).length).toBeGreaterThan(0);
  });
});
