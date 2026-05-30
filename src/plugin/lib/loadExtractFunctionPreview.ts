import { readFileSync } from "node:fs";
import path from "node:path";

import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";

export interface ExtractFunctionSkillPreview {
  description: string;
  entry: CatalogEntry;
}

const EXTRACT_FUNCTION_SLUG = "extract-function";
const SNIPPET_RELATIVE_PATH = ["public", "snippets", "refactorings", "extract-function.md"];

export function loadExtractFunctionPreview(): ExtractFunctionSkillPreview {
  const { entry } = findCatalogEntryBySlug(EXTRACT_FUNCTION_SLUG, loadRefactorings());
  const description = readDescriptionFromSnippet();
  return { description, entry };
}

function readDescriptionFromSnippet(): string {
  const snippetPath = path.join(process.cwd(), ...SNIPPET_RELATIVE_PATH);
  const raw = readFileSync(snippetPath, "utf8");
  return parseFrontmatterDescription(raw);
}

function parseFrontmatterDescription(raw: string): string {
  const match = raw.match(/^---\nname: [^\n]+\ndescription: (.+)\n---/);
  const description = match?.[1];
  if (description === undefined) {
    throw new Error(
      "loadExtractFunctionPreview: extract-function.md snippet is missing a description frontmatter field",
    );
  }
  return description;
}
