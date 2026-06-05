import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;
// Target range per ADR-0013: 40-60 words per field. The ceiling applies
// to every entry; the floor applies only to entries that have opted into
// the ADR-0013 discipline by adopting at least one glossary marker on the
// agent side. Un-marked entries remain editorial until the corpus
// migration reaches them.
const HARD_CEILING_WORDS = 60;
const HARD_FLOOR_WORDS = 40;

function isOptedIn(entry: CatalogEntry): boolean {
  const agent = entry.forcesFor("agent" as Lens);
  return FORCE_FIELDS.some((field) => /\{\{/.test(agent[field]));
}

function wordCount(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

interface Hit {
  entry: string;
  field: string;
  words: number;
}

function scanCeiling(entries: readonly CatalogEntry[]): Hit[] {
  const hits: Hit[] = [];
  for (const entry of entries) {
    const agent = entry.forcesFor("agent" as Lens);
    for (const field of FORCE_FIELDS) {
      const words = wordCount(agent[field]);
      if (words > HARD_CEILING_WORDS) {
        hits.push({
          entry: entry.name.toString(),
          field: `agent.${field}`,
          words,
        });
      }
    }
  }
  return hits;
}

function scanFloor(entries: readonly CatalogEntry[]): Hit[] {
  const hits: Hit[] = [];
  for (const entry of entries) {
    if (!isOptedIn(entry)) continue;
    const agent = entry.forcesFor("agent" as Lens);
    for (const field of FORCE_FIELDS) {
      const words = wordCount(agent[field]);
      if (words < HARD_FLOOR_WORDS) {
        hits.push({
          entry: entry.name.toString(),
          field: `agent.${field}`,
          words,
        });
      }
    }
  }
  return hits;
}

function formatCeilingHits(hits: readonly Hit[]): string {
  return hits
    .map((h) => `  - ${h.entry} :: ${h.field} :: ${h.words} words (ceiling ${HARD_CEILING_WORDS})`)
    .join("\n");
}

function formatFloorHits(hits: readonly Hit[]): string {
  return hits
    .map((h) => `  - ${h.entry} :: ${h.field} :: ${h.words} words (floor ${HARD_FLOOR_WORDS})`)
    .join("\n");
}

describe(`agent-side force fields stay under the ${HARD_CEILING_WORDS}-word ceiling (ADR-0010)`, () => {
  it("contains no field over the hard ceiling across smells, refactorings, and patterns", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scanCeiling(allEntries);
    expect(hits, `\n${formatCeilingHits(hits)}\n`).toEqual([]);
  });
});

describe(`opted-in agent-side fields stay above the ${HARD_FLOOR_WORDS}-word floor (ADR-0013)`, () => {
  it("contains no field under the floor on entries that have adopted glossary markers", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scanFloor(allEntries);
    expect(hits, `\n${formatFloorHits(hits)}\n`).toEqual([]);
  });
});
