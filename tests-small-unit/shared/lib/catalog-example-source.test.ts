import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

const MIN_LENGTH = 30;

// Author surnames that, when mentioned in exampleSource, oblige the
// citation to include a chapter, page, or section reference. Keeps the
// site honest about what's adapted from a book vs. illustrative.
const CITED_AUTHORS = ["Fowler", "Kerievsky", "Gamma", "Helm", "Johnson", "Vlissides", "Beck"];
const AUTHOR_PATTERN = new RegExp(`\\b(?:${CITED_AUTHORS.join("|")})\\b`);
const LOCATION_PATTERN = /\b(?:chapter|page|p\.|pp\.|section|§)\b/i;

interface Hit {
  entry: string;
  reason: string;
}

function check(entry: CatalogEntry): Hit | null {
  const source = entry.exampleSource;
  if (typeof source !== "string" || source.trim().length === 0) {
    return {
      entry: entry.name.toString(),
      reason: "exampleSource is missing or empty",
    };
  }
  if (source.trim().length < MIN_LENGTH) {
    return {
      entry: entry.name.toString(),
      reason: `exampleSource is too short (${source.trim().length} chars; need at least ${MIN_LENGTH}) — name the source or mark as illustrative`,
    };
  }
  if (AUTHOR_PATTERN.test(source) && !LOCATION_PATTERN.test(source)) {
    return {
      entry: entry.name.toString(),
      reason: `exampleSource cites an author but no chapter/page/section reference — add a precise location for the citation`,
    };
  }
  return null;
}

function formatHits(hits: readonly Hit[]): string {
  return hits.map((h) => `  - ${h.entry} :: ${h.reason}`).join("\n");
}

describe("every catalog entry has a sourced or marked-illustrative exampleSource", () => {
  it("exampleSource is non-empty, of minimum length, and properly located when it cites an author", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits: Hit[] = [];
    for (const entry of allEntries) {
      const hit = check(entry);
      if (hit !== null) hits.push(hit);
    }
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
