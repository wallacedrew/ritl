import { describe, expect, it } from "vitest";

import { buildCatalogDetailCore } from "@/shared/lib/buildCatalogDetailCore";
import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";

const filler = Forces.from({
  symptom: "s",
  goal: "g",
  pressure: "p",
  tradeoff: "t",
  relief: "r",
  trap: "x",
});

function smell(): CatalogEntry {
  return CatalogEntry.from({
    catalog: "smells",
    name: CatalogEntryName.smell("Long Function"),
    nemeses: [CatalogEntryName.refactoring("Extract Function")],
    before: "before-code",
    after: "after-code",
    forces: { human: filler, agent: filler },
    exampleSource: "an-example.ts",
  });
}

const neighbors = { prev: null, next: null };

describe("buildCatalogDetailCore", () => {
  it("pre-resolves the four hrefs from the entity", () => {
    const core = buildCatalogDetailCore({
      entry: smell(),
      number: 12,
      relatedNames: [],
      neighbors,
      backLinkHref: "/refactoring/smells",
      backLinkLabel: "Smells",
      beforeLabel: "Smellier version",
      afterLabel: "Fresher version",
    });

    expect(core.humanHref).toBe("/refactoring/smells/long-function/human");
    expect(core.agentHref).toBe("/refactoring/smells/long-function/agent");
    expect(core.compareHref).toBe("/refactoring/smells/long-function/compare");
    expect(core.snippetHref).toBe("/snippets/smells/long-function.md");
  });

  it("carries the per-catalog labels and before/after code through unchanged", () => {
    const core = buildCatalogDetailCore({
      entry: smell(),
      number: 12,
      relatedNames: [],
      neighbors,
      backLinkHref: "/refactoring/smells",
      backLinkLabel: "Smells",
      beforeLabel: "Smellier version",
      afterLabel: "Fresher version",
    });

    expect(core.backLinkHref).toBe("/refactoring/smells");
    expect(core.backLinkLabel).toBe("Smells");
    expect(core.beforeLabel).toBe("Smellier version");
    expect(core.afterLabel).toBe("Fresher version");
    expect(core.beforeCode).toBe("before-code");
    expect(core.afterCode).toBe("after-code");
    expect(core.exampleSource).toBe("an-example.ts");
  });

  it("delegates the header build to toCatalogEntryHeaderViewModel", () => {
    const core = buildCatalogDetailCore({
      entry: smell(),
      number: 12,
      relatedNames: [CatalogEntryName.refactoring("Extract Function")],
      inboundPatternNames: [CatalogEntryName.pattern("Strategy", "gof")],
      neighbors,
      backLinkHref: "/refactoring/smells",
      backLinkLabel: "Smells",
      beforeLabel: "Smellier version",
      afterLabel: "Fresher version",
    });

    expect(core.header.title).toBe("Long Function");
    expect(core.header.nemesesLabel).toBe("Apply refactorings");
    expect(core.header.relatedChips).toHaveLength(1);
    expect(core.header.inboundPatternChips).toHaveLength(1);
  });

  it("does not include forces — the per-catalog factory layers them on", () => {
    const core = buildCatalogDetailCore({
      entry: smell(),
      number: 12,
      relatedNames: [],
      neighbors,
      backLinkHref: "/refactoring/smells",
      backLinkLabel: "Smells",
      beforeLabel: "Smellier version",
      afterLabel: "Fresher version",
    });

    expect(core).not.toHaveProperty("forces");
    expect(core).not.toHaveProperty("humanForces");
    expect(core).not.toHaveProperty("agentForces");
  });
});
