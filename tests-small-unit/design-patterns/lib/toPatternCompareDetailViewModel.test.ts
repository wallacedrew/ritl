import { describe, expect, it } from "vitest";

import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";
import { toPatternCompareDetailViewModel } from "@/design-patterns/lib/toPatternCompareDetailViewModel";

const filler = Forces.from({
  symptom: "s",
  goal: "g",
  pressure: "p",
  tradeoff: "t",
  relief: "r",
  trap: "x",
});

const pattern = CatalogEntry.from({
  catalog: "design-patterns",
  book: "gof",
  name: CatalogEntryName.pattern("Strategy", "gof"),
  nemeses: [],
  before: "B",
  after: "A",
  forces: { human: filler, agent: filler },
});

const kerievskySource = CatalogEntryName.refactoring(
  "Replace Conditional Logic with Strategy",
  "kerievsky",
);
const neighbors = { prev: null, next: null };

describe("toPatternCompareDetailViewModel", () => {
  it("routes back to the GoF landing", () => {
    const viewModel = toPatternCompareDetailViewModel({
      pattern,
      number: 21,
      incomingSourceNames: [],
      neighbors,
    });

    expect(viewModel.backLinkHref).toBe("/design-patterns");
  });

  it("projects incoming Kerievsky sources as header chips", () => {
    const viewModel = toPatternCompareDetailViewModel({
      pattern,
      number: 21,
      incomingSourceNames: [kerievskySource],
      neighbors,
    });

    expect(viewModel.header.incomingSourceChips).toEqual([
      {
        label: "Replace Conditional Logic with Strategy",
        href: "/refactoring-to-patterns/replace-conditional-logic-with-strategy",
        tone: "kerievsky-refactoring",
      },
    ]);
  });

  it("exposes both lenses' forces", () => {
    const viewModel = toPatternCompareDetailViewModel({
      pattern,
      number: 21,
      incomingSourceNames: [],
      neighbors,
    });

    expect(viewModel.humanForces.symptom).toBe("s");
    expect(viewModel.agentForces.symptom).toBe("s");
  });
});
