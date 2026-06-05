import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;

/**
 * ADR-0011 §2 mechanism-citation rule.
 *
 * Every agent-side field must name a "specific LLM-mechanical currency
 * the agent pays or saves." The ADR lists eight canonical currencies and
 * marks the list as non-exhaustive. We accept those eight plus the
 * underlying ADR-0009 mechanism nouns that name the same mechanism
 * without the cost suffix (a field that says "the agent's context
 * window holds X" is naming the context-window mechanism even though
 * it doesn't write the bound phrase "context-window load").
 *
 * Scoped to entries that have opted into ADR-0013 by adopting at least
 * one agent-side glossary marker — un-marked entries remain editorial
 * until the corpus migration reaches them.
 */
const ACCEPTED_MECHANISMS: readonly string[] = [
  // 8 canonical cost currencies (ADR-0011 §2)
  "context-window load",
  "token cost",
  "retrieval cost",
  "reasoning-step cost",
  "type-checker visibility",
  "cache-staleness cost",
  "completeness-check cost",
  "verification-surface cost",
  // ADR-0009 mechanism nouns naming the same mechanism without cost suffix
  "context window",
  "tokens",
  "reasoning step",
  "type checker",
  "type-checker",
  "RAG",
  "chain-of-thought",
  "lost-in-the-middle",
  "context overflow",
];

function isOptedIn(entry: CatalogEntry): boolean {
  const agent = entry.forcesFor("agent" as Lens);
  return FORCE_FIELDS.some((field) => /\{\{/.test(agent[field]));
}

function citesAMechanism(text: string): boolean {
  const lower = text.toLowerCase();
  return ACCEPTED_MECHANISMS.some((mechanism) => lower.includes(mechanism.toLowerCase()));
}

interface Hit {
  entry: string;
  field: string;
}

function scan(entries: readonly CatalogEntry[]): Hit[] {
  const hits: Hit[] = [];
  for (const entry of entries) {
    if (!isOptedIn(entry)) continue;
    const agent = entry.forcesFor("agent" as Lens);
    for (const field of FORCE_FIELDS) {
      if (!citesAMechanism(agent[field])) {
        hits.push({ entry: entry.name.toString(), field: `agent.${field}` });
      }
    }
  }
  return hits;
}

function formatHits(hits: readonly Hit[]): string {
  return hits
    .map(
      (h) =>
        `  - ${h.entry} :: ${h.field} — names no ADR-0011 §2 mechanism currency (e.g., context-window load, token cost, retrieval cost, reasoning-step cost, type-checker visibility, completeness-check cost, verification-surface cost, cache-staleness cost) and no underlying ADR-0009 mechanism noun (context window, tokens, reasoning step, RAG, type checker, etc.)`,
    )
    .join("\n");
}

describe("opted-in agent-side fields cite an LLM mechanism (ADR-0011 §2)", () => {
  it("every field names one of the canonical mechanism currencies or its underlying mechanism noun", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scan(allEntries);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
