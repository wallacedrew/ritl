import type { CatalogEntryName } from "./CatalogEntryName";

export function generateCatalogStaticParams<T extends { name: CatalogEntryName }>(
  items: readonly T[],
): Array<{ slug: string }> {
  return items.map((item) => ({ slug: item.name.toSlug().toString() }));
}
