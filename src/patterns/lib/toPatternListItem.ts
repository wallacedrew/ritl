import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

export function toPatternListItem(pattern: CatalogEntry, number: number): CatalogListItem {
  return {
    number,
    href: pattern.name.toCatalogHref(),
    name: pattern.name.toString(),
    tone: pattern.name.tone(),
    chips: pattern.nemeses.map((nemesisName) => ({
      label: nemesisName.toString(),
      tone: nemesisName.tone(),
    })),
    caption: pattern.forcesFor("human").goal,
  };
}
