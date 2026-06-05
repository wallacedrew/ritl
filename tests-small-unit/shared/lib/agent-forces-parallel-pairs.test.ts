import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;

/**
 * Parallel-pair map per docs/glossary.md.
 *
 * Each agent-side cost term has a primary human-side counterpart and a
 * permitted set of related human-side cost terms that satisfy the
 * parallel-pair constraint. The intent is structural symmetry: when an
 * entry surfaces an agent-side cost, the human side should name the
 * cognate human cost — directly or via a closely-related cost term in
 * the same family.
 *
 * Scoped to entries that have opted into the marking discipline (any
 * agent-side {{...}} marker present). Un-marked entries remain
 * editorial until the corpus migration reaches them.
 */
const PAIRS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["context-window load", ["comprehension cost", "cognitive load"]],
  [
    "token cost",
    [
      "mental effort",
      "comprehension cost",
      "maintenance cost",
      "debugging cost",
      "enhancement cost",
      "verification cost",
    ],
  ],
  ["retrieval cost", ["search cost", "comprehension cost"]],
  ["reasoning-step cost", ["inference-step cost", "mental effort", "cognitive load"]],
  ["completeness-check cost", ["verification cost"]],
  ["verification-surface cost", ["verification cost"]],
  ["cache-staleness cost", ["knowledge-decay cost", "maintenance cost"]],
];

function joinedLens(entry: CatalogEntry, lens: Lens): string {
  const forces = entry.forcesFor(lens);
  return FORCE_FIELDS.map((field) => forces[field])
    .join(" ")
    .toLowerCase();
}

function isOptedIn(entry: CatalogEntry): boolean {
  return /\{\{/.test(joinedLens(entry, "agent" as Lens));
}

interface Hit {
  entry: string;
  agentTerm: string;
  acceptableHumanTerms: readonly string[];
}

function scan(entries: readonly CatalogEntry[]): Hit[] {
  const hits: Hit[] = [];
  for (const entry of entries) {
    if (!isOptedIn(entry)) continue;
    const agentText = joinedLens(entry, "agent" as Lens);
    const humanText = joinedLens(entry, "human" as Lens);
    for (const [agentTerm, humanOptions] of PAIRS) {
      if (!agentText.includes(agentTerm)) continue;
      const satisfied = humanOptions.some((option) => humanText.includes(option));
      if (!satisfied) {
        hits.push({
          entry: entry.name.toString(),
          agentTerm,
          acceptableHumanTerms: humanOptions,
        });
      }
    }
  }
  return hits;
}

function formatHits(hits: readonly Hit[]): string {
  return hits
    .map(
      (h) =>
        `  - ${h.entry} :: agent uses "${h.agentTerm}" but human side names none of [${h.acceptableHumanTerms.join(", ")}]`,
    )
    .join("\n");
}

describe("opted-in entries surface the human-side cost parallel for each agent-side cost they cite", () => {
  it("each agent-side cost term has a counterpart on human side across smells, refactorings, and patterns", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scan(allEntries);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
