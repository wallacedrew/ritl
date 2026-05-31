import { describe, expect, it } from "vitest";

import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";
import { toSmellCompareDetailViewModel } from "@/smells/lib/toSmellCompareDetailViewModel";

const human = Forces.from({
  symptom: "s-human",
  goal: "g-human",
  pressure: "p-human",
  tradeoff: "t-human",
  relief: "r-human",
  trap: "x-human",
});

const agent = Forces.from({
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
  nemeses: [],
  before: "B",
  after: "A",
  forces: { human, agent },
});

const neighbors = { prev: null, next: null };

describe("toSmellCompareDetailViewModel", () => {
  it("carries both lenses' forces side-by-side", () => {
    const viewModel = toSmellCompareDetailViewModel({
      smell,
      number: 12,
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.humanForces.symptom).toBe("s-human");
    expect(viewModel.agentForces.symptom).toBe("s-agent");
    expect(viewModel.humanForces.trap).toBe("x-human");
    expect(viewModel.agentForces.trap).toBe("x-agent");
  });

  it("hardcodes the smell back-link and labels", () => {
    const viewModel = toSmellCompareDetailViewModel({
      smell,
      number: 12,
      inboundPatternNames: [],
      neighbors,
    });

    expect(viewModel.backLinkHref).toBe("/refactoring/smells");
    expect(viewModel.backLinkLabel).toBe("Smells");
    expect(viewModel.beforeLabel).toBe("Smellier version");
    expect(viewModel.afterLabel).toBe("Fresher version");
  });
});
