import { describe, expect, it } from "vitest";

import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";
import { toPatternDetailViewModel } from "@/design-patterns/lib/toPatternDetailViewModel";

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

describe("toPatternDetailViewModel", () => {
  it("routes back to the GoF landing", () => {
    const viewModel = toPatternDetailViewModel({
      pattern,
      number: 21,
      lens: "human",
      incomingSourceNames: [],
      neighbors,
    });

    expect(viewModel.backLinkHref).toBe("/design-patterns");
    expect(viewModel.backLinkLabel).toBe("Patterns");
  });

  it("hardcodes the pattern before/after labels", () => {
    const viewModel = toPatternDetailViewModel({
      pattern,
      number: 21,
      lens: "human",
      incomingSourceNames: [],
      neighbors,
    });

    expect(viewModel.beforeLabel).toBe("Before the pattern");
    expect(viewModel.afterLabel).toBe("After the pattern");
  });

  it("exposes incoming Kerievsky sources as chips on the header", () => {
    const viewModel = toPatternDetailViewModel({
      pattern,
      number: 21,
      lens: "human",
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

  it("pre-resolves the three lens hrefs and the snippet href for the pattern", () => {
    const viewModel = toPatternDetailViewModel({
      pattern,
      number: 21,
      lens: "human",
      incomingSourceNames: [],
      neighbors,
    });

    expect(viewModel.humanHref).toBe("/design-patterns/strategy/human");
    expect(viewModel.agentHref).toBe("/design-patterns/strategy/agent");
    expect(viewModel.compareHref).toBe("/design-patterns/strategy/compare");
    expect(viewModel.snippetHref).toBe("/snippets/design-patterns/strategy.md");
  });
});
