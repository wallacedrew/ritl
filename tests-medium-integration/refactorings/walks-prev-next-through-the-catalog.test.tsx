import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";

describe("user walks the refactorings catalog with prev/next tiles", () => {
  it("on the first refactoring, shows Next only", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "extract-function" }),
    });

    renderWithTheme(ui);

    expect(screen.queryByRole("link", { name: /^previous/i })).toBeNull();
    const nextLink = screen.getByRole("link", { name: /next/i });
    expect(nextLink).toHaveAttribute("href", "/refactorings/inline-function");
  });

  it("on a middle refactoring, shows both Prev and Next pointing to neighbors", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "change-function-declaration" }),
    });

    renderWithTheme(ui);

    const prevLink = screen.getByRole("link", { name: /previous/i });
    const nextLink = screen.getByRole("link", { name: /next/i });
    expect(prevLink).toHaveAttribute("href", "/refactorings/inline-variable");
    expect(nextLink).toHaveAttribute("href", "/refactorings/encapsulate-variable");
  });

  it("on the last refactoring, shows Previous only", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "replace-superclass-with-delegate" }),
    });

    renderWithTheme(ui);

    expect(screen.queryByRole("link", { name: /^next/i })).toBeNull();
    expect(screen.getByRole("link", { name: /previous/i })).toBeInTheDocument();
  });
});
