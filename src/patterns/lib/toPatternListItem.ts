import { collectCrossReferences, type CatalogSnapshot } from "@/shared/lib/collectCrossReferences";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

export function toPatternListItem(
  pattern: CatalogEntry,
  number: number,
  snapshot?: CatalogSnapshot,
): CatalogListItem {
  return {
    number,
    href: pattern.name.toCatalogHref(),
    name: pattern.name.toString(),
    tone: pattern.name.tone(),
    caption: pattern.forcesFor("human").goal,
    crossReferences: snapshot ? collectCrossReferences(pattern, snapshot) : undefined,
  };
}
