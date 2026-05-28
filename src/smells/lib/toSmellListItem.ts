import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

export function toSmellListItem(smell: CatalogEntry, number: number): CatalogListItem {
  return {
    number,
    href: smell.name.toCatalogHref(),
    name: smell.name.toString(),
    chips: smell.nemeses.map((nemesis) => ({
      label: nemesis.toString(),
      tone: nemesis.tone(),
    })),
    caption: smell.forcesFor("human").symptom,
  };
}
