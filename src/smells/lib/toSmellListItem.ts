import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";
import { firstSentenceCaption } from "@/shared/lib/firstSentenceCaption";

export function toSmellListItem(smell: CatalogEntry, number: number): CatalogListItem {
  return {
    number,
    href: smell.name.toCatalogHref(),
    name: smell.name.toString(),
    tone: smell.name.tone(),
    caption: firstSentenceCaption(smell.forcesFor("human").symptom),
  };
}
