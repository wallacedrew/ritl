import { collectCrossReferences, type CatalogSnapshot } from "@/shared/lib/collectCrossReferences";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogListItem } from "@/shared/lib/CatalogListItem";

export function toSmellListItem(
  smell: CatalogEntry,
  number: number,
  snapshot?: CatalogSnapshot,
): CatalogListItem {
  return {
    number,
    href: smell.name.toCatalogHref(),
    name: smell.name.toString(),
    tone: smell.name.tone(),
    chips: smell.nemeses.map((nemesis) => ({
      label: nemesis.toString(),
      tone: nemesis.tone(),
    })),
    caption: smell.forcesFor("human").symptom,
    crossReferences: snapshot ? collectCrossReferences(smell, snapshot) : undefined,
  };
}
