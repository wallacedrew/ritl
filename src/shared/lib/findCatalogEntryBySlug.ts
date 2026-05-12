import { notFound } from "next/navigation";

import { Slug } from "./Slug";

export function findCatalogEntryBySlug<T extends { name: string }>(
  rawSlug: string,
  items: readonly T[],
): { entry: T; number: number } {
  const requested = Slug.fromUrlPart(rawSlug);
  const index = items.findIndex((candidate) => Slug.from(candidate.name).equals(requested));
  const entry = items[index];
  if (entry === undefined) {
    notFound();
  }
  return { entry, number: index + 1 };
}
