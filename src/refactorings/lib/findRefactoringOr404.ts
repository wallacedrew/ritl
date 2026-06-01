import { notFound } from "next/navigation";

import type { CatalogEntry, RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";

import { loadRefactoringsByBook } from "./loadRefactoringsByBook";

export async function findRefactoringOr404(
  params: Promise<{ slug: string }>,
  book: RefactoringBook,
): Promise<{ entry: CatalogEntry; number: number }> {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadRefactoringsByBook(book));
  if (found === undefined) notFound();
  return found;
}
