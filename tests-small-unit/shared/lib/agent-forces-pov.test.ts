import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;

interface BannedPronoun {
  pattern: RegExp;
  reason: string;
}

const BANNED_PRONOUNS: readonly BannedPronoun[] = [
  {
    pattern: /\byou\b/i,
    reason: "second person ('you'); ADR-0010 — subject is 'the agent', not the reader",
  },
  {
    pattern: /\byour\b/i,
    reason: "second person ('your'); ADR-0010 — subject is 'the agent', not the reader",
  },
  {
    pattern: /\byours\b/i,
    reason: "second person ('yours'); ADR-0010 — subject is 'the agent', not the reader",
  },
  {
    pattern: /\bwe\b/i,
    reason: "first person plural ('we'); ADR-0010 — subject is 'the agent'",
  },
  {
    pattern: /\bour\b/i,
    reason: "first person plural ('our'); ADR-0010 — subject is 'the agent'",
  },
  {
    pattern: /\bours\b/i,
    reason: "first person plural ('ours'); ADR-0010 — subject is 'the agent'",
  },
  {
    pattern: /\bI\b/,
    reason: "first person singular ('I'); ADR-0010 — subject is 'the agent'",
  },
  {
    pattern: /\bmy\b/i,
    reason: "first person singular ('my'); ADR-0010 — subject is 'the agent'",
  },
  {
    pattern: /\bmine\b/i,
    reason: "first person singular ('mine'); ADR-0010 — subject is 'the agent'",
  },
  {
    pattern: /\blet's\b/i,
    reason: "first person plural imperative ('let's'); ADR-0010 — declarative, third person only",
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
    const agent = entry.forcesFor("agent" as Lens);
    for (const field of FORCE_FIELDS) {
      const text = agent[field];
      for (const { pattern, reason } of BANNED_PRONOUNS) {
        const match = text.match(pattern);
        if (match !== null) {
          hits.push({
            entry: entry.name.toString(),
            field: `agent.${field}`,
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

describe("agent-side forces use third-person POV with 'the agent' as the subject (ADR-0010)", () => {
  it("contains no second-person or first-person pronouns in any agent-side field", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scan(allEntries);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
