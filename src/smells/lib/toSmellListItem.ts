import { slugify } from "@/shared/lib/slugify";

import type { Smell } from "./Smell";
import type { SmellListItem } from "./SmellListItem";

export function toSmellListItem(smell: Smell): SmellListItem {
  return {
    href: `/smells/${slugify(smell.name)}`,
    name: smell.name,
    refactoring: smell.refactoring,
    symptom: smell.symptom,
  };
}
