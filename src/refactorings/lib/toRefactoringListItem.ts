import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";
import { firstSentenceCaption } from "@/shared/lib/firstSentenceCaption";

export function toRefactoringListItem(refactoring: CatalogEntry, number: number): CatalogListItem {
  return {
    number,
    href: refactoring.name.toCatalogHref(),
    name: refactoring.name.toString(),
    tone: refactoring.name.tone(),
    caption: firstSentenceCaption(refactoring.forcesFor("human").goal),
  };
}
