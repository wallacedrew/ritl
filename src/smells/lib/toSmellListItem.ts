import type { CatalogListItem } from "@/shared/lib/CatalogListItem";
import { Slug } from "@/shared/lib/Slug";

import type { Smell } from "./Smell";

export function toSmellListItem(smell: Smell, number: number): CatalogListItem {
  return {
    number,
    href: Slug.from(smell.name).toCatalogHref("smells"),
    name: smell.name,
    chips: smell.refactorings,
    caption: smell.symptom,
  };
}
