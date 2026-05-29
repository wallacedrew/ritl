import { collectCrossReferences, type CatalogSnapshot } from "@/shared/lib/collectCrossReferences";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

export function toRefactoringListItem(
  refactoring: CatalogEntry,
  number: number,
  snapshot?: CatalogSnapshot,
): CatalogListItem {
  return {
    number,
    href: refactoring.name.toCatalogHref(),
    name: refactoring.name.toString(),
    tone: refactoring.name.tone(),
    caption: refactoring.forcesFor("human").goal,
    crossReferences: snapshot ? collectCrossReferences(refactoring, snapshot) : undefined,
  };
}
