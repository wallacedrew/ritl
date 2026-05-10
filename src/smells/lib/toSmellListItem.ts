import type { Smell } from "./Smell";
import type { SmellListItem } from "./SmellListItem";

export function toSmellListItem(smell: Smell): SmellListItem {
  return {
    name: smell.name,
    refactoring: smell.refactoring,
    symptom: smell.symptom,
  };
}
