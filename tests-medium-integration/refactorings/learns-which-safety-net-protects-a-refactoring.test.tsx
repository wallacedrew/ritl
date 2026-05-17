import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";

describe("user learns which safety net protects a refactoring", () => {
  it("sees the 'types/compiler' safety net on /refactorings/rename-variable", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "rename-variable" }),
    });

    renderWithTheme(ui);

    expect(screen.getByText(/safety net/i)).toBeInTheDocument();
    expect(screen.getByText("types/compiler")).toBeInTheDocument();
  });

  it("does not show the safety net line on a refactoring without one classified yet", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "extract-function" }),
    });

    renderWithTheme(ui);

    expect(screen.queryByText(/safety net/i)).not.toBeInTheDocument();
  });
});
