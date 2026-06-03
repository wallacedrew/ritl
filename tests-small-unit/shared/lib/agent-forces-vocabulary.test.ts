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
    reason: "dramatic verb ('blow(s) up'); use neutral mechanism (e.g. 'exceeds', 'saturates')",
  },
  {
    pattern: /\bburn\b[^.]{0,40}(context|tokens?)/i,
    reason: "rhetorical 'burn ... context/tokens'; describe the cost concretely",
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
    pattern: /\bspurious diff/i,
    reason: "value-laden noun ('spurious diff'); describe what the diff actually contains",
  },
  {
    pattern: /\bdiff surface\b/i,
    reason:
      "boilerplate ('diff surface'); name the concrete edit scope (files, methods, call sites)",
  },
  {
    pattern: /\bsource of truth\b/i,
    reason: "cliché ('source of truth'); name what the agent actually reads",
  },
  {
    pattern: /\bground truth\b/i,
    reason: "cliché ('ground truth'); name what the agent actually reads",
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
    reason: "narrative cliché ('jumps off the page'); name what the agent reads concretely",
  },
  {
    pattern: /\bpaged[ -]out\b/i,
    reason:
      "OS-memory-management borrowing ('paged out'); ADR-0009 bans — use 'outside the context window' or 'unread' instead",
  },
  {
    pattern: /\bpaging\b/i,
    reason:
      "OS-memory-management borrowing ('paging'); ADR-0009 bans — use 'outside the context window' instead",
  },
  {
    pattern: /\bworking set\b/i,
    reason:
      "OS-memory-management borrowing ('working set'); ADR-0009 bans — use 'context window' instead",
  },
  {
    pattern: /\bfocused-attention\b/i,
    reason:
      "invented compound ('focused-attention'); ADR-0009 bans — use canonical 'context window' or 'lost-in-the-middle'",
  },
  {
    pattern: /\bduplicate-payload\b/i,
    reason:
      "invented compound ('duplicate-payload'); ADR-0009 bans — describe the token cost concretely",
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
      for (const { pattern, reason } of BANNED_PATTERNS) {
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

describe("agent-side forces stay in neutral facts-only voice (ADR-0006)", () => {
  it("uses no banned rhetorical or generic vocabulary across smells, refactorings, and patterns", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scan(allEntries);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
