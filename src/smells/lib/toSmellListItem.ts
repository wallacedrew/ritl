import { Slug } from "@/shared/lib/Slug";

import type { Smell } from "./Smell";
import type { SmellListItem } from "./SmellListItem";

export function toSmellListItem(smell: Smell, number: number): SmellListItem {
  return {
    number,
    href: Slug.from(smell.name).toCatalogHref("smells"),
    name: smell.name,
    refactorings: smell.refactorings,
    symptom: smell.symptom,
  };
}
