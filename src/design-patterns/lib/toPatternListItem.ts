import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";
import { firstSentenceCaption } from "@/shared/lib/firstSentenceCaption";

export function toPatternListItem(pattern: CatalogEntry, number: number): CatalogListItem {
  return {
    number,
    href: pattern.name.toCatalogHref(),
    name: pattern.name.toString(),
    tone: pattern.name.tone(),
    caption: firstSentenceCaption(pattern.forcesFor("human").goal),
  };
}
