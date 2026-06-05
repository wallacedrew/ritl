import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;

interface BannedPattern {
  pattern: RegExp;
  reason: string;
}

// Subset of the agent-side ban list scoped to human-side prose. We exclude
// agent-specific OS-borrowed terms (paging, working set, focused-attention)
// since those never appear on the human side; we keep the universal
// anti-rhetoric and anti-platitude bans so both columns share a neutral voice.
const BANNED_PATTERNS: readonly BannedPattern[] = [
  {
    pattern: /\bcompulsive\b/i,
    reason: "emotional verb ('compulsive'); ADR-0006 bans rhetorical drama",
  },
  {
    pattern: /\bdread\b/i,
    reason: "emotional verb ('dread'); ADR-0006 bans rhetorical drama",
  },
  {
    pattern: /\btwisted\b/i,
    reason: "rhetorical adjective ('twisted'); use neutral structural language",
  },
  {
    pattern: /\bmaze\b/i,
    reason: "metaphor ('maze'); name the specific structural cost",
  },
  {
    pattern: /\btar pit\b/i,
    reason: "metaphor ('tar pit'); name the specific failure mode",
  },
  {
    pattern: /\bblows? up\b/i,
    reason: "dramatic verb ('blow(s) up'); use neutral mechanism (e.g. 'scales', 'exceeds')",
  },
  {
    pattern: /\bmakes it easier\b/i,
    reason: "generic verb ('makes it easier'); name the specific improvement",
  },
  {
    pattern: /\breduces friction\b/i,
    reason: "generic verb ('reduces friction'); name the specific improvement",
  },
  {
    pattern: /\bimproves clarity\b/i,
    reason: "generic verb ('improves clarity'); name the specific improvement",
  },
  {
    pattern: /\bsource of truth\b/i,
    reason: "cliché ('source of truth'); name the canonical declaration concretely",
  },
  {
    pattern: /\bground truth\b/i,
    reason: "cliché ('ground truth'); name what the reader actually consults",
  },
  {
    pattern: /\bcode is the documentation\b/i,
    reason: "platitude ('code is the documentation'); name the specific cost dropped",
  },
  {
    pattern: /\bbecomes mechanical\b/i,
    reason: "generic verb ('becomes mechanical'); name the specific cost",
  },
  {
    pattern: /\bbecomes readable\b/i,
    reason: "generic verb ('becomes readable'); name the specific cost",
  },
  {
    pattern: /\bjumps off the page\b/i,
    reason: "narrative cliché ('jumps off the page'); name what the reader sees concretely",
  },
];

interface Hit {
  entry: string;
  field: string;
  matched: string;
  reason: string;
}

function scan(entries: readonly CatalogEntry[]): Hit[] {
  const hits: Hit[] = [];
  for (const entry of entries) {
    const human = entry.forcesFor("human" as Lens);
    for (const field of FORCE_FIELDS) {
      const text = human[field];
      for (const { pattern, reason } of BANNED_PATTERNS) {
        const match = text.match(pattern);
        if (match !== null) {
          hits.push({
            entry: entry.name.toString(),
            field: `human.${field}`,
            matched: match[0],
            reason,
          });
        }
      }
    }
  }
  return hits;
}

function formatHits(hits: readonly Hit[]): string {
  return hits
    .map((h) => `  - ${h.entry} :: ${h.field} :: matched "${h.matched}" — ${h.reason}`)
    .join("\n");
}

describe("human-side forces stay in neutral facts-only voice (ADR-0006)", () => {
  it("uses no banned rhetorical or generic vocabulary across smells, refactorings, and patterns", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scan(allEntries);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
