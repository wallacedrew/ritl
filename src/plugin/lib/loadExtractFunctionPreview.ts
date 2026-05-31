import { readFileSync } from "node:fs";
import path from "node:path";

import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";

export interface ExtractFunctionSkillPreview {
  description: string;
  entry: CatalogEntry;
  rawMarkdown: string;
}

const EXTRACT_FUNCTION_SLUG = "extract-function";
const SNIPPET_RELATIVE_PATH = ["public", "snippets", "refactorings", "extract-function.md"];

export function loadExtractFunctionPreview(): ExtractFunctionSkillPreview {
  const found = findCatalogEntryBySlug(EXTRACT_FUNCTION_SLUG, loadRefactorings());
  if (found === undefined) {
    throw new Error(
      `loadExtractFunctionPreview: "${EXTRACT_FUNCTION_SLUG}" not found in the refactorings catalog`,
    );
  }
  const { entry } = found;
  const snippetPath = path.join(process.cwd(), ...SNIPPET_RELATIVE_PATH);
  const rawMarkdown = readFileSync(snippetPath, "utf8");
  const description = parseFrontmatterDescription(rawMarkdown);
  return { description, entry, rawMarkdown };
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
