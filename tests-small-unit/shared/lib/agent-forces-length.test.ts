import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;
// Target range per ADR-0012: 50-75 words per field. The ceiling is
// lint-enforced; the 50-word floor is editorial (the rest of the
// corpus pre-dates this range and is being migrated incrementally).
const HARD_CEILING_WORDS = 75;

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

function scan(entries: readonly CatalogEntry[]): Hit[] {
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

function formatHits(hits: readonly Hit[]): string {
  return hits
    .map((h) => `  - ${h.entry} :: ${h.field} :: ${h.words} words (ceiling ${HARD_CEILING_WORDS})`)
    .join("\n");
}

describe(`agent-side force fields stay under the ${HARD_CEILING_WORDS}-word ceiling (ADR-0010)`, () => {
  it("contains no field over the hard ceiling across smells, refactorings, and patterns", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scan(allEntries);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
