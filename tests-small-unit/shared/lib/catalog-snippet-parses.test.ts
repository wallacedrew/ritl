import { parse } from "@babel/parser";
import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

interface ParseFailure {
  entry: string;
  field: "before" | "after";
  message: string;
}

function tryParseSnippet(code: string): string | null {
  for (const sourceType of ["script", "module"] as const) {
    try {
      parse(code, {
        sourceType,
        allowReturnOutsideFunction: true,
        plugins: ["typescript", "classProperties"],
      });
      return null;
    } catch {
      // try next sourceType
    }
  }
  try {
    parse(code, {
      sourceType: "script",
      allowReturnOutsideFunction: true,
      plugins: ["typescript", "classProperties"],
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

function scan(entries: readonly CatalogEntry[]): ParseFailure[] {
  const failures: ParseFailure[] = [];
  for (const entry of entries) {
    for (const field of ["before", "after"] as const) {
      const code = entry[field];
      if (!code) continue;
      const message = tryParseSnippet(code);
      if (message !== null) {
        failures.push({ entry: entry.name.toString(), field, message });
      }
    }
  }
  return failures;
}

function formatFailures(failures: readonly ParseFailure[]): string {
  return failures.map((f) => `  - ${f.entry} :: ${f.field} — ${f.message}`).join("\n");
}

describe("catalog before/after snippets are syntactically valid JavaScript/TypeScript", () => {
  it("parses every before/after snippet across smells, refactorings, and patterns", () => {
    const allEntries = [...loadSmells(), ...loadRefactorings(), ...loadPatterns()];
    const failures = scan(allEntries);
    expect(failures, `\n${formatFailures(failures)}\n`).toEqual([]);
  });
});
