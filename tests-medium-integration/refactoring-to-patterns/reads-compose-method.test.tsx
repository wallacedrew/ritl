// ATDD test for Slice 2 of the sub-site reorganization: Kerievsky's
// Refactoring to Patterns becomes a second sub-site at /refactoring-to-patterns,
// with Compose Method as the tracer-bullet entry. Skipped until the inner
// microtests bring the slice end-to-end green. When unskipped, uncomment
// imports and assertions inside each `it`.
import { describe, it } from "vitest";

describe.skip("user reads Compose Method via the Kerievsky sub-site", () => {
  it("home page offers a Refactoring to Patterns card linking to /refactoring-to-patterns", () => {
    // const { default: HomePage } = await import("@/home/HomePage");
    // renderWithTheme(<HomePage />);
    // const kerievskyCardLink = screen.getByRole("link", { name: /Refactoring to Patterns/i });
    // expect(kerievskyCardLink).toHaveAttribute("href", "/refactoring-to-patterns");
  });

  it("Kerievsky landing shows Compose Method as a browseable entry", () => {
    // Renders KerievskyLandingPage; asserts a link to Compose Method at
    // /refactoring-to-patterns/compose-method.
  });

  it("Compose Method detail renders at /refactoring-to-patterns/compose-method with cross-sub-site nemesis links into Fowler", () => {
    // Renders PatternsDetailPage for slug "compose-method"; asserts H1 reads
    // "Compose Method", both human and agent forces show, before/after
    // snippets render, agent + compare lens links resolve to
    // /refactoring-to-patterns/compose-method/{agent,compare}, and a nemesis
    // link to "Extract Function" resolves to
    // /refactoring/refactorings/extract-function (cross-sub-site).
  });
});
