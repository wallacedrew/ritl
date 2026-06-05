import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

// Strip line + block comments so a pure-placeholder snippet
// (`/* ... */`, `// TODO`) collapses to whitespace and fails the
// "must have substantive code" check.
function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
}

function hasSubstance(code: string): boolean {
  const stripped = stripComments(code).trim();
  if (stripped.length === 0) return false;
  // After comment-stripping, require at least one identifier-like token.
  return /[A-Za-z_$][A-Za-z0-9_$]*/.test(stripped);
}

interface Hit {
  entry: string;
  reason: string;
}

function check(entry: CatalogEntry): Hit[] {
  const hits: Hit[] = [];
  const before = entry.before ?? "";
  const after = entry.after ?? "";

  if (before.trim().length === 0) {
    hits.push({ entry: entry.name.toString(), reason: "before is missing or empty" });
  }
  if (after.trim().length === 0) {
    hits.push({ entry: entry.name.toString(), reason: "after is missing or empty" });
  }
  if (before.trim() === after.trim() && before.trim().length > 0) {
    hits.push({
      entry: entry.name.toString(),
      reason: "before and after are identical — the refactoring shows no structural change",
    });
  }
  if (before.trim().length > 0 && !hasSubstance(before)) {
    hits.push({
      entry: entry.name.toString(),
      reason:
        "before is a placeholder (comments/whitespace only); the snippet must demonstrate the smell",
    });
  }
  if (after.trim().length > 0 && !hasSubstance(after)) {
    hits.push({
      entry: entry.name.toString(),
      reason:
        "after is a placeholder (comments/whitespace only); the snippet must demonstrate the result",
    });
  }
  return hits;
}

function formatHits(hits: readonly Hit[]): string {
  return hits.map((h) => `  - ${h.entry} :: ${h.reason}`).join("\n");
}

describe("catalog before/after snippets show a meaningful structural change", () => {
  it("each entry has non-empty, non-identical, non-placeholder before and after", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const hits: Hit[] = [];
    for (const entry of allEntries) {
      hits.push(...check(entry));
    }
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });
});
