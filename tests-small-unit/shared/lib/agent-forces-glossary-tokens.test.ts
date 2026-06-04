import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { isKnownTerm } from "@/shared/lib/glossary";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;
const TOKEN_PATTERN = /\{\{\s*([^}]+?)\s*\}\}/g;

interface Hit {
  entry: string;
  field: string;
  key: string;
}

function scan(entries: readonly CatalogEntry[]): Hit[] {
  const hits: Hit[] = [];
  for (const entry of entries) {
    const agent = entry.forcesFor("agent" as Lens);
    for (const field of FORCE_FIELDS) {
      const text = agent[field];
      const matches = text.matchAll(TOKEN_PATTERN);
      for (const match of matches) {
        const captured = match[1];
        if (captured === undefined) continue;
        const key = captured.trim();
        if (!isKnownTerm(key)) {
          hits.push({
            entry: entry.name.toString(),
            field: `agent.${field}`,
            key,
          });
        }
      }
    }
  }
  return hits;
}

function formatHits(hits: readonly Hit[]): string {
  return hits
    .map((h) => `  - ${h.entry} :: ${h.field} :: unknown glossary key "${h.key}"`)
    .join("\n");
}

describe("every {{glossary-key}} token in agent-side fields resolves to a known term", () => {
  it("matches every token to a glossary entry across smells, refactorings, and patterns", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scan(allEntries);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
