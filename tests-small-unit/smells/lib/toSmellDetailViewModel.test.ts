import { describe, expect, it } from "vitest";

import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";
import { toSmellDetailViewModel } from "@/smells/lib/toSmellDetailViewModel";

const filler = Forces.from({
  symptom: "s-human",
  goal: "g-human",
  pressure: "p-human",
  tradeoff: "t-human",
  relief: "r-human",
  trap: "x-human",
});

const agentFiller = Forces.from({
  symptom: "s-agent",
  goal: "g-agent",
  pressure: "p-agent",
  tradeoff: "t-agent",
  relief: "r-agent",
  trap: "x-agent",
});

const smell = CatalogEntry.from({
  catalog: "smells",
  name: CatalogEntryName.smell("Long Function"),
  nemeses: [CatalogEntryName.refactoring("Extract Function")],
  before: "function f() { /* long body */ }",
  after: "function f() { extract(); }",
  forces: { human: filler, agent: agentFiller },
});

const inboundPattern = CatalogEntryName.pattern("Strategy", "gof");
const neighbors = { prev: null, next: null };

describe("toSmellDetailViewModel", () => {
  it("pre-resolves the four detail hrefs for the smell", () => {
    const viewModel = toSmellDetailViewModel({
      smell,
      number: 12,
      lens: "human",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.humanHref).toBe("/refactoring/smells/long-function/human");
    expect(viewModel.agentHref).toBe("/refactoring/smells/long-function/agent");
    expect(viewModel.compareHref).toBe("/refactoring/smells/long-function/compare");
    expect(viewModel.snippetHref).toBe("/snippets/smells/long-function.md");
  });

  it("hardcodes the smell back-link and before/after labels", () => {
    const viewModel = toSmellDetailViewModel({
      smell,
      number: 12,
      lens: "human",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.backLinkHref).toBe("/refactoring/smells");
    expect(viewModel.backLinkLabel).toBe("Smells");
    expect(viewModel.beforeLabel).toBe("Smellier version");
    expect(viewModel.afterLabel).toBe("Fresher version");
  });

  it("projects the human-lens forces when lens=human", () => {
    const viewModel = toSmellDetailViewModel({
      smell,
      number: 12,
      lens: "human",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.forces).toEqual({
      symptom: "s-human",
      goal: "g-human",
      pressure: "p-human",
      tradeoff: "t-human",
      relief: "r-human",
      trap: "x-human",
    });
  });

  it("projects the agent-lens forces when lens=agent", () => {
    const viewModel = toSmellDetailViewModel({
      smell,
      number: 12,
      lens: "agent",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.forces.symptom).toBe("s-agent");
  });

  it("builds a header with the Apply-refactorings label and the related chips", () => {
    const viewModel = toSmellDetailViewModel({
      smell,
      number: 12,
      lens: "human",
      inboundPatternNames: [inboundPattern],
      neighbors,
    });

    expect(viewModel.header.title).toBe("Long Function");
    expect(viewModel.header.nemesesLabel).toBe("Apply refactorings");
    expect(viewModel.header.relatedChips).toEqual([
      {
        label: "Extract Function",
        href: "/refactoring/canon/extract-function",
        tone: "fowler-refactoring",
      },
    ]);
    expect(viewModel.header.inboundPatternChips).toEqual([
      { label: "Strategy", href: "/design-patterns/strategy", tone: "pattern" },
    ]);
  });

  it("carries the before/after code through unchanged", () => {
    const viewModel = toSmellDetailViewModel({
      smell,
      number: 12,
      lens: "human",
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.beforeCode).toBe("function f() { /* long body */ }");
    expect(viewModel.afterCode).toBe("function f() { extract(); }");
  });
});
