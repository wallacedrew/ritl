import type { Smell } from "./Smell";

const STRING_FIELDS = ["name", "symptom", "risk", "goal", "savings", "before", "after"] as const;

export function parseSmell(raw: unknown): Smell {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("parseSmell: expected an object");
  }

  const record = raw as Record<string, unknown>;
  const result = {} as Record<string, unknown>;

  for (const field of STRING_FIELDS) {
    const value = record[field];
    if (typeof value !== "string") {
      throw new Error(`parseSmell: field "${field}" must be a string`);
    }
    result[field] = value;
  }

  const refactorings = record.refactorings;
  if (!Array.isArray(refactorings)) {
    throw new Error('parseSmell: field "refactorings" must be an array');
  }
  for (const candidate of refactorings) {
    if (typeof candidate !== "string") {
      throw new Error('parseSmell: every entry in "refactorings" must be a string');
    }
  }
  result.refactorings = refactorings;

  return result as Smell;
}
