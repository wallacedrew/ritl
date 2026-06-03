import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import designPatternsJson from "@/design-patterns/content/design-patterns.json";
import refactoringsJson from "@/refactorings/content/refactorings.json";
import smellsJson from "@/smells/content/smells.json";
import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

const projectRoot = resolve(__dirname, "../../../");

function snippetFilePathFor(href: string): string {
  return resolve(projectRoot, "public" + href);
}

interface RawEntry {
  name: string;
  book?: string;
}

describe("every catalog entry's Preview-markdown URL resolves to a real file on disk", () => {
  it("ships a /snippets/refactorings/<slug>.md for every refactoring", () => {
    const missing: string[] = [];
    for (const raw of refactoringsJson as RawEntry[]) {
      const book = raw.book === "kerievsky" ? "kerievsky" : "fowler";
      const href = CatalogEntryName.refactoring(raw.name, book).toSnippetHref();
      if (!existsSync(snippetFilePathFor(href))) missing.push(href);
    }
    expect(missing).toEqual([]);
  });

  it("ships a /snippets/smells/<slug>.md for every smell", () => {
    const missing: string[] = [];
    for (const raw of smellsJson as RawEntry[]) {
      const href = CatalogEntryName.smell(raw.name).toSnippetHref();
      if (!existsSync(snippetFilePathFor(href))) missing.push(href);
    }
    expect(missing).toEqual([]);
  });

  it("ships a /snippets/design-patterns/<slug>.md for every design pattern", () => {
    const missing: string[] = [];
    for (const raw of designPatternsJson as RawEntry[]) {
      const book = raw.book === "kerievsky" ? "kerievsky" : "gof";
      const href = CatalogEntryName.pattern(raw.name, book).toSnippetHref();
      if (!existsSync(snippetFilePathFor(href))) missing.push(href);
    }
    expect(missing).toEqual([]);
  });
});
