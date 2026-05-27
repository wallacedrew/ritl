import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

export function toPatternListItem(pattern: CatalogEntry, number: number): CatalogListItem {
  return {
    number,
    href: pattern.name.toCatalogHref(),
    name: pattern.name.toString(),
    chips: pattern.nemeses.map((nemesisName) => nemesisName.toString()),
    caption: pattern.forcesFor("human").goal,
  };
}
