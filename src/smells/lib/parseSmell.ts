import type { Smell } from "./Smell";

const STRING_FIELDS = [
  "name",
  "symptom",
  "risk",
  "refactoring",
  "goal",
  "savings",
  "before",
  "after",
] as const satisfies readonly (keyof Smell)[];

export function parseSmell(raw: unknown): Smell {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("parseSmell: expected an object");
  }

  const record = raw as Record<string, unknown>;
  const result = {} as Record<keyof Smell, string>;

  for (const field of STRING_FIELDS) {
    const value = record[field];
    if (typeof value !== "string") {
      throw new Error(`parseSmell: field "${field}" must be a string`);
    }
    result[field] = value;
  }

  return result;
}
