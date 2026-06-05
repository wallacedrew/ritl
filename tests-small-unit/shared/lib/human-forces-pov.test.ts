import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;

// ADR-0010 modal-reader contract: agent-side prose uses "the agent";
// human-side prose uses neutral third-person ("the team", "the reader",
// "callers", "reviewers"). First-person and second-person pronouns are
// banned: they break the modal-reader contract and force the reader to
// re-orient on every use ("am I being addressed? are they?").
interface BannedPattern {
  pattern: RegExp;
  reason: string;
}

const BANNED_PATTERNS: readonly BannedPattern[] = [
  {
    pattern: /\b(you|your|yours|yourself)\b/i,
    reason:
      "2nd-person pronoun ('you'); use neutral third-person ('the team', 'the reader', 'callers')",
  },
  {
    pattern: /\b(we|we're|we've|our|ours|us|let's)\b/i,
    reason: "1st-person plural ('we'); use neutral third-person ('the team', 'the codebase')",
  },
  {
    pattern: /\b(i|i'm|i've)\b/i,
    reason:
      "1st-person singular ('I'); use neutral third-person or indirect form ('the developer', 'a reader')",
  },
];

// Strip backtick-delimited code spans so identifiers like `amounts[i]`
// don't trip the 1st-person 'i' rule. Markdown convention: single
// backticks delimit inline code; triple backticks delimit blocks.
function stripCodeSpans(text: string): string {
  return text.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ");
}

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
      const text = stripCodeSpans(human[field]);
      for (const { pattern, reason } of BANNED_PATTERNS) {
        const match = text.match(pattern);
        if (match !== null) {
          hits.push({
            entry: entry.name.toString(),
            field: `human.${field}`,
            matched: match[0],
            reason,
          });
          break;
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

describe("human-side forces use neutral third-person voice (ADR-0010)", () => {
  it("uses no first-person or second-person pronouns across smells, refactorings, and patterns", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scan(allEntries);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
