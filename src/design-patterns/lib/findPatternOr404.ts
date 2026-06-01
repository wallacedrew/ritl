import { notFound } from "next/navigation";

import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";

import { loadPatterns } from "./loadPatterns";

export async function findPatternOr404(
  params: Promise<{ slug: string }>,
): Promise<{ entry: CatalogEntry; number: number }> {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadPatterns());
  if (found === undefined) notFound();
  return found;
}
