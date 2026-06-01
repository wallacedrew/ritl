import { notFound } from "next/navigation";

import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";

import { loadSmells } from "./loadSmells";

export async function findSmellOr404(
  params: Promise<{ slug: string }>,
): Promise<{ entry: CatalogEntry; number: number }> {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadSmells());
  if (found === undefined) notFound();
  return found;
}
