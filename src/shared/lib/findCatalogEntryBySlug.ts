import { notFound } from "next/navigation";

import type { CatalogEntryName } from "./CatalogEntryName";
import { Slug } from "./Slug";

export function findCatalogEntryBySlug<T extends { name: CatalogEntryName }>(
  rawSlug: string,
  items: readonly T[],
): { entry: T; number: number } {
  const requested = Slug.fromUrlPart(rawSlug);
  const index = items.findIndex((candidate) => candidate.name.toSlug().equals(requested));
  const entry = items[index];
  if (entry === undefined) {
    notFound();
  }
  return { entry, number: index + 1 };
}
