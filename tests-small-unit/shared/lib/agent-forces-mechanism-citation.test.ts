import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { GLOSSARY } from "@/shared/lib/glossary";

const FORCE_FIELDS = ["symptom", "goal", "pressure", "tradeoff", "relief", "trap"] as const;

// ADR-0011 §2: every agent-side field names a mechanism. The proxy lint
// requires that each field reference at least one canonical glossary
// term (in any form, marked or unmarked, any casing). Scoped to entries
// that have opted into ADR-0013 by adopting at least one agent-side
// glossary marker — un-marked entries remain editorial until migrated.
const GLOSSARY_KEYS = Object.keys(GLOSSARY).map((k) => k.toLowerCase());

function isOptedIn(entry: CatalogEntry): boolean {
  const agent = entry.forcesFor("agent" as Lens);
  return FORCE_FIELDS.some((field) => /\{\{/.test(agent[field]));
}

function citesAMechanism(text: string): boolean {
  const lower = text.toLowerCase();
  return GLOSSARY_KEYS.some((key) => lower.includes(key));
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
        `  - ${h.entry} :: ${h.field} — references no canonical glossary term (ADR-0011 §2 mechanism citation)`,
    )
    .join("\n");
}

describe("opted-in agent-side fields cite a mechanism (ADR-0011 §2)", () => {
  it("every field references at least one glossary term on entries that have adopted markers", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits = scan(allEntries);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
