import { describe, expect, it } from "vitest";

import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";
import { toRefactoringDetailViewModel } from "@/refactorings/lib/toRefactoringDetailViewModel";

const filler = Forces.from({
  symptom: "s",
  goal: "g",
  pressure: "p",
  tradeoff: "t",
  relief: "r",
  trap: "x",
});

function fowlerEntry(): CatalogEntry {
  return CatalogEntry.from({
    catalog: "refactorings",
    book: "fowler",
    name: CatalogEntryName.refactoring("Extract Function"),
    nemeses: [CatalogEntryName.smell("Long Function")],
    before: "B",
    after: "A",
    forces: { human: filler, agent: filler },
  });
}

function kerievskyEntry(): CatalogEntry {
  return CatalogEntry.from({
    catalog: "refactorings",
    book: "kerievsky",
    name: CatalogEntryName.refactoring("Compose Method", "kerievsky"),
    nemeses: [],
    before: "B",
    after: "A",
    forces: { human: filler, agent: filler },
    destinationPattern: CatalogEntryName.pattern("Composite", "gof"),
  });
}

const neighbors = { prev: null, next: null };

describe("toRefactoringDetailViewModel", () => {
  it("routes a Fowler entry back to /refactoring/canon", () => {
    const viewModel = toRefactoringDetailViewModel({
      refactoring: fowlerEntry(),
      number: 1,
      lens: "human",
      book: "fowler",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.backLinkHref).toBe("/refactoring/canon");
    expect(viewModel.backLinkLabel).toBe("Refactorings");
  });

  it("routes a Kerievsky entry back to /refactoring-to-patterns", () => {
    const viewModel = toRefactoringDetailViewModel({
      refactoring: kerievskyEntry(),
      number: 1,
      lens: "human",
      book: "kerievsky",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.backLinkHref).toBe("/refactoring-to-patterns");
    expect(viewModel.backLinkLabel).toBe("Refactoring to Patterns");
  });

  it("emits a destination chip when the entry declares a destinationPattern", () => {
    const viewModel = toRefactoringDetailViewModel({
      refactoring: kerievskyEntry(),
      number: 1,
      lens: "human",
      book: "kerievsky",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.header.destinationChip).toEqual({
      label: "Composite",
      href: "/design-patterns/composite",
      tone: "pattern",
    });
  });

  it("hardcodes the refactoring before/after labels", () => {
    const viewModel = toRefactoringDetailViewModel({
      refactoring: fowlerEntry(),
      number: 1,
      lens: "human",
      book: "fowler",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.beforeLabel).toBe("Before the refactoring");
    expect(viewModel.afterLabel).toBe("After the refactoring");
  });

  it("uses the Removes-smells header label for a Fowler refactoring", () => {
    const viewModel = toRefactoringDetailViewModel({
      refactoring: fowlerEntry(),
      number: 1,
      lens: "human",
      book: "fowler",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.header.nemesesLabel).toBe("Removes smells");
  });

  it("uses the Triggered-by header label for a Kerievsky refactoring", () => {
    const viewModel = toRefactoringDetailViewModel({
      refactoring: kerievskyEntry(),
      number: 1,
      lens: "human",
      book: "kerievsky",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.header.nemesesLabel).toBe("Triggered by");
  });
});
