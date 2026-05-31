import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../tests-small-unit/_helpers/renderWithTheme";
import HomePage from "@/home/HomePage";
import KerievskyLandingPage from "@/refactorings/KerievskyLandingPage";
import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";

describe("user reads Compose Method via the Kerievsky sub-site", () => {
  it("home page offers a Refactoring to Patterns card linking to /refactoring-to-patterns", () => {
    renderWithTheme(<HomePage />);

    const kerievskyCardLink = screen.getByRole("link", { name: "Refactoring to Patterns" });
    expect(kerievskyCardLink).toHaveAttribute("href", "/refactoring-to-patterns");
  });

  it("Kerievsky landing shows Compose Method as a browseable entry", () => {
    renderWithTheme(<KerievskyLandingPage />);

    const composeMethodLinks = screen.getAllByRole("link", { name: /Compose Method/i });
    expect(composeMethodLinks[0]).toHaveAttribute(
      "href",
      "/refactoring-to-patterns/compose-method",
    );
  });

  it("Compose Method detail renders at /refactoring-to-patterns/compose-method with cross-sub-site nemesis links into Fowler", async () => {
    const ui = await RefactoringDetailPage({
      params: Promise.resolve({ slug: "compose-method" }),
      book: "kerievsky",
    });
    renderWithTheme(ui);

    expect(screen.getByRole("heading", { name: "Compose Method", level: 1 })).toBeInTheDocument();

    const extractFunctionLink = screen.getByRole("link", { name: "Extract Function" });
    expect(extractFunctionLink).toHaveAttribute("href", "/refactoring/canon/extract-function");

    const longFunctionLink = screen.getByRole("link", { name: "Long Function" });
    expect(longFunctionLink).toHaveAttribute("href", "/refactoring/smells/long-function");

    expect(screen.getByText(/numbered outline of intention-revealing steps/i)).toBeInTheDocument();
    expect(screen.getByText(/list is read-only/)).toBeInTheDocument();
    expect(screen.getByText(/assertWritable/)).toBeInTheDocument();

    const agentLink = screen.getByRole("link", { name: "Agent" });
    expect(agentLink).toHaveAttribute("href", "/refactoring-to-patterns/compose-method/agent");

    const compareLink = screen.getByRole("link", { name: "Compare" });
    expect(compareLink).toHaveAttribute("href", "/refactoring-to-patterns/compose-method/compare");
  });
});
