import { describe, expect, it } from "vitest";

import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";
import { toRefactoringCompareDetailViewModel } from "@/refactorings/lib/toRefactoringCompareDetailViewModel";

const filler = Forces.from({
  symptom: "s",
  goal: "g",
  pressure: "p",
  tradeoff: "t",
  relief: "r",
  trap: "x",
});

function entry(book: "fowler" | "kerievsky"): CatalogEntry {
  return CatalogEntry.from({
    catalog: "refactorings",
    book,
    name: CatalogEntryName.refactoring(
      book === "kerievsky" ? "Compose Method" : "Extract Function",
      book,
    ),
    nemeses: [],
    before: "B",
    after: "A",
    forces: { human: filler, agent: filler },
  });
}

const neighbors = { prev: null, next: null };

describe("toRefactoringCompareDetailViewModel", () => {
  it("routes a Fowler compare view back to /refactoring/canon", () => {
    const viewModel = toRefactoringCompareDetailViewModel({
      refactoring: entry("fowler"),
      number: 1,
      book: "fowler",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.backLinkHref).toBe("/refactoring/canon");
  });

  it("routes a Kerievsky compare view back to /refactoring-to-patterns", () => {
    const viewModel = toRefactoringCompareDetailViewModel({
      refactoring: entry("kerievsky"),
      number: 1,
      book: "kerievsky",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.backLinkHref).toBe("/refactoring-to-patterns");
  });

  it("carries both lenses' forces", () => {
    const viewModel = toRefactoringCompareDetailViewModel({
      refactoring: entry("fowler"),
      number: 1,
      book: "fowler",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.humanForces).toEqual({
      symptom: "s",
      goal: "g",
      pressure: "p",
      tradeoff: "t",
      relief: "r",
      trap: "x",
    });
    expect(viewModel.agentForces).toEqual(viewModel.humanForces);
  });
});
