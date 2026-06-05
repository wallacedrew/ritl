import { describe, expect, it } from "vitest";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";

/**
 * Tier-2 semantic-correctness lint: each GoF pattern's `after` snippet
 * must contain its canonical structural signature.
 *
 * Each pattern maps to a list of regexes; ALL must match the `after`
 * snippet for the entry to pass. The regexes are grounded in the
 * existing snippets — they encode what the canonical shape of the
 * pattern looks like at the token level, not what every valid
 * implementation must contain. The lint catches "the author pasted
 * unrelated code" or "the snippet drifted away from the pattern's
 * structural identity," not subtle implementation differences.
 *
 * To regenerate signatures when a pattern's canonical example changes,
 * update the SIGNATURES map and re-baseline against the new `after`.
 */
const SIGNATURES: Record<string, readonly RegExp[]> = {
  "Abstract Factory": [/\w+Factory\b/, /create\w+\s*\(/],
  Builder: [/Builder\b/, /\bbuild\s*\(/],
  "Factory Method": [/\bextends\s+\w+/, /create\w+\s*\(/],
  Prototype: [/\bclone\s*\(/],
  Singleton: [/\bgetInstance\b/],
  Adapter: [/\w*Adapter\b/],
  Bridge: [/\w*Renderer\b/],
  Composite: [/\bchildren\b/, /\.reduce\s*\(/],
  Decorator: [/\w*Decorator\b/, /\bwrapped\b/],
  Facade: [/\w*Facade\b/],
  Flyweight: [/\bcache\b/, /Registry\b/],
  Proxy: [/\w*Proxy\b/],
  "Chain of Responsibility": [/\bHandler\b/, /this\.next|super\.handle/],
  Command: [/\bexecute\s*\(/, /\bundo\s*\(/],
  Interpreter: [/\binterpret\s*\(/],
  Iterator: [/Symbol\.iterator/, /\bdone\b/],
  Mediator: [/Mediator|mediator/],
  Memento: [/Memento\b/, /\bsave\s*\(/, /\brestore\s*\(/],
  Observer: [/\bsubscribe\s*\(/, /\bnotify\s*\(|\bobservers\b/],
  State: [/\w+State\b/, /\bsetState\s*\(/],
  Strategy: [/Strategy|strategy/],
  "Template Method": [/\bextends\s+\w+/, /\bthrow\s+new\s+Error/],
  Visitor: [/\baccept\s*\(/, /\bvisit\w+/],
};

interface Hit {
  entry: string;
  missingSignature: string;
}

function scan(entries: readonly CatalogEntry[]): Hit[] {
  const hits: Hit[] = [];
  for (const entry of entries) {
    const name = entry.name.toString();
    const signatures = SIGNATURES[name];
    if (signatures === undefined) continue;
    const after = entry.after ?? "";
    for (const sig of signatures) {
      if (!sig.test(after)) {
        hits.push({ entry: name, missingSignature: sig.source });
      }
    }
  }
  return hits;
}

function formatHits(hits: readonly Hit[]): string {
  return hits
    .map(
      (h) =>
        `  - ${h.entry} :: after snippet is missing canonical signature /${h.missingSignature}/`,
    )
    .join("\n");
}

describe("each GoF pattern's after snippet contains its canonical structural signature", () => {
  it("the 23 GoF entries each demonstrate their pattern at the token level", () => {
    const patterns = loadPatterns();
    const hits = scan(patterns);
    expect(hits, `\n${formatHits(hits)}\n`).toEqual([]);
  });

  it("the SIGNATURES map covers every GoF entry", () => {
    const patterns = loadPatterns();
    const uncovered = patterns
      .map((p) => p.name.toString())
      .filter((name) => SIGNATURES[name] === undefined);
    expect(uncovered).toEqual([]);
  });
});
