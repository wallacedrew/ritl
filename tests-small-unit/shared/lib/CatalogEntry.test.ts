import { describe, expect, it } from "vitest";

import { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";
import { Forces } from "@/shared/lib/Forces";
import { SafetyNet } from "@/refactorings/lib/SafetyNet";

const validForcesRecord = {
  symptom: "S",
  goal: "G",
  pressure: "P",
  tradeoff: "T",
  relief: "R",
  trap: "X",
};

function makeEntry(overrides: Partial<Parameters<typeof CatalogEntry.from>[0]> = {}): CatalogEntry {
  return CatalogEntry.from({
    catalog: "smells",
    name: CatalogEntryName.smell("Long Function"),
    nemeses: [CatalogEntryName.refactoring("Extract Function")],
    before: "code A",
    after: "code B",
    forces: {
      human: Forces.from(validForcesRecord),
      agent: Forces.from(validForcesRecord),
    },
    ...overrides,
  });
}

describe("CatalogEntry", () => {
  it("rejects an unknown catalog kind at construction", () => {
    expect(() => makeEntry({ catalog: "unknown" as never })).toThrow(/unknown catalog/i);
  });

  it("rejects an empty before code", () => {
    expect(() => makeEntry({ before: "" })).toThrow(/before.*cannot be empty/i);
  });

  it("rejects an empty after code", () => {
    expect(() => makeEntry({ after: "   " })).toThrow(/after.*cannot be empty/i);
  });

  it("exposes catalog, name, nemeses, before, after, forces as readonly properties", () => {
    const entry = makeEntry();

    expect(entry.catalog).toBe("smells");
    expect(entry.name.toString()).toBe("Long Function");
    expect(entry.nemeses).toHaveLength(1);
    expect(entry.before).toBe("code A");
    expect(entry.after).toBe("code B");
  });

  it("forcesFor returns the human forces for the human lens", () => {
    const human = Forces.from({ ...validForcesRecord, symptom: "human symptom" });
    const agent = Forces.from({ ...validForcesRecord, symptom: "agent symptom" });
    const entry = makeEntry({ forces: { human, agent } });

    expect(entry.forcesFor("human").symptom).toBe("human symptom");
    expect(entry.forcesFor("agent").symptom).toBe("agent symptom");
  });

  it("href derives from the catalog entry name", () => {
    expect(makeEntry().href()).toBe("/refactoring/smells/long-function");
  });

  it("agentHref appends /agent to the href", () => {
    expect(makeEntry().agentHref()).toBe("/refactoring/smells/long-function/agent");
  });

  it("compareHref appends /compare to the href", () => {
    expect(makeEntry().compareHref()).toBe("/refactoring/smells/long-function/compare");
  });

  it("optional safetyNet is undefined when not provided", () => {
    expect(makeEntry().safetyNet).toBeUndefined();
  });

  it("optional safetyNet is exposed when provided", () => {
    const entry = makeEntry({ safetyNet: SafetyNet.from("types/compiler") });
    expect(entry.safetyNet?.toString()).toBe("types/compiler");
  });

  it("treats entries with same catalog + name as equal", () => {
    const first = makeEntry();
    const second = makeEntry();
    expect(first.equals(second)).toBe(true);
  });

  it("treats entries with different names as unequal", () => {
    const first = makeEntry();
    const second = makeEntry({ name: CatalogEntryName.smell("Mysterious Name") });
    expect(first.equals(second)).toBe(false);
  });

  it("treats entries with different catalogs as unequal even with matching names", () => {
    const first = makeEntry({
      catalog: "refactorings",
      name: CatalogEntryName.refactoring("Same Name"),
      nemeses: [CatalogEntryName.smell("Long Function")],
    });
    const second = makeEntry({
      catalog: "smells",
      name: CatalogEntryName.smell("Same Name"),
      nemeses: [CatalogEntryName.refactoring("Extract Function")],
    });
    expect(first.equals(second)).toBe(false);
  });

  it("rejects a pattern entry that does not declare a book", () => {
    expect(() =>
      makeEntry({
        catalog: "patterns",
        name: CatalogEntryName.pattern("Strategy", "kerievsky"),
        nemeses: [],
      }),
    ).toThrow(/pattern entries must declare a "book"/i);
  });

  it("rejects a pattern entry with an unknown book", () => {
    expect(() =>
      makeEntry({
        catalog: "patterns",
        name: CatalogEntryName.pattern("Strategy", "kerievsky"),
        nemeses: [],
        book: "fowler" as never,
      }),
    ).toThrow(/unknown pattern book "fowler"/i);
  });

  it("rejects a non-pattern entry that carries a book field", () => {
    expect(() => makeEntry({ book: "kerievsky" })).toThrow(
      /"book" is only allowed on pattern entries/i,
    );
  });

  it("exposes the declared book on a pattern entry", () => {
    const entry = makeEntry({
      catalog: "patterns",
      name: CatalogEntryName.pattern("Strategy", "kerievsky"),
      nemeses: [],
      book: "gof",
    });
    expect(entry.book).toBe("gof");
  });

  it("leaves book undefined on smells and refactorings", () => {
    expect(makeEntry().book).toBeUndefined();
  });
});
