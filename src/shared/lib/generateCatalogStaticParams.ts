import { Slug } from "./Slug";

export function generateCatalogStaticParams<T extends { name: string }>(
  items: readonly T[],
): Array<{ slug: string }> {
  return items.map((item) => ({ slug: Slug.from(item.name).toString() }));
}
