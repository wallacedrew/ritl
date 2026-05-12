import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

import type { Smell } from "./Smell";

function readStringField(record: Record<string, unknown>, field: string): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new Error(`parseSmell: field "${field}" must be a string`);
  }
  return value;
}

export function parseSmell(raw: unknown): Smell {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("parseSmell: expected an object");
  }

  const record = raw as Record<string, unknown>;

  const refactorings = record.refactorings;
  if (!Array.isArray(refactorings)) {
    throw new Error('parseSmell: field "refactorings" must be an array');
  }
  const wrappedRefactorings: CatalogEntryName[] = refactorings.map((candidate) => {
    if (typeof candidate !== "string") {
      throw new Error('parseSmell: every entry in "refactorings" must be a string');
    }
    return CatalogEntryName.refactoring(candidate);
  });

  return {
    name: CatalogEntryName.smell(readStringField(record, "name")),
    symptom: readStringField(record, "symptom"),
    risk: readStringField(record, "risk"),
    refactorings: wrappedRefactorings,
    goal: readStringField(record, "goal"),
    savings: readStringField(record, "savings"),
    before: readStringField(record, "before"),
    after: readStringField(record, "after"),
  };
}
