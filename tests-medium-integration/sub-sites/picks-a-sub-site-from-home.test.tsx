// ATDD test for Slice 1 of the sub-site reorganization. Skipped until the
// slice is end-to-end green (home becomes a picker, /refactoring becomes the
// Fowler landing, catalog URLs nest under /refactoring/). When unskipped,
// uncomment the imports and assertions inside each `it`.
import { describe, it } from "vitest";

describe.skip("user picks a sub-site from the home page picker", () => {
  it("home page offers a Fowler card linking to /refactoring", () => {
    // const { renderWithTheme } = await import("../../tests-small-unit/_helpers/renderWithTheme");
    // const { default: HomePage } = await import("@/home/HomePage");
    // renderWithTheme(<HomePage />);
    // const fowlerCardLink = screen.getByRole("link", { name: /Refactoring/i });
    // expect(fowlerCardLink).toHaveAttribute("href", "/refactoring");
  });

  it("Fowler landing shows chapter groupings and links into catalog list pages", () => {
    // Renders FowlerLandingPage (src/refactoring/FowlerLandingPage.tsx),
    // expects chapter headings (Composing Methods etc.), and links to
    // /refactoring/refactorings and /refactoring/smells.
  });

  it("refactoring detail pages render at /refactoring/refactorings/:slug", () => {
    // Renders RefactoringDetailPage for slug "extract-function" and asserts
    // its Agent and Compare lens links nest under /refactoring/refactorings/.
  });
});
