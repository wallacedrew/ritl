import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import RefactoringComparePage from "@/refactorings/RefactoringComparePage";

/**
 * Regression test for the ADR-0007 Phase B silent regression:
 * a Fowler refactoring's "Referenced by patterns" group must continue
 * to list Kerievsky entries that nemesise it, even after Kerievsky
 * moved out of the patterns catalog. The fix lives in
 * `RefactoringComparePage.tsx`, which now feeds both `loadPatterns()`
 * AND `loadKerievsky()` into `findInboundPatterns`.
 *
 * "Replace Conditional with Polymorphism" is referenced by 7 Kerievsky
 * entries — a high enough count that even one missing chip would be
 * impossible to dismiss as a one-off.
 */
describe("user reads a Fowler refactoring's Referenced-by-patterns list", () => {
  it("Replace Conditional with Polymorphism still lists its Kerievsky inbound references", async () => {
    const ui = await RefactoringComparePage({
      params: Promise.resolve({ slug: "replace-conditional-with-polymorphism" }),
    });
    renderWithTheme(ui);

    // Replace Conditional Logic with Strategy is one of the Kerievsky
    // refactorings that nemesise Replace Conditional with Polymorphism.
    // Its chip should appear under the "Referenced by patterns" group
    // and link to /refactoring-to-patterns/replace-conditional-logic-with-strategy.
    const strategyLinks = screen.getAllByRole("link", {
      name: "Replace Conditional Logic with Strategy",
    });
    const kerievskyLink = strategyLinks.find(
      (link) =>
        link.getAttribute("href") ===
        "/refactoring-to-patterns/replace-conditional-logic-with-strategy",
    );
    expect(kerievskyLink).toBeDefined();
  });
});
