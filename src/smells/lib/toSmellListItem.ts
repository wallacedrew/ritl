import { slugify } from "@/shared/lib/slugify";

import type { Smell } from "./Smell";
import type { SmellListItem } from "./SmellListItem";

export function toSmellListItem(smell: Smell, number: number): SmellListItem {
  return {
    number,
    href: `/smells/${slugify(smell.name)}`,
    name: smell.name,
    refactorings: smell.refactorings,
    symptom: smell.symptom,
  };
}
