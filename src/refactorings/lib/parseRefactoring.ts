import type { Refactoring } from "./Refactoring";

const STRING_FIELDS = ["name", "risk", "goal", "savings", "before", "after"] as const;

export function parseRefactoring(raw: unknown): Refactoring {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("parseRefactoring: expected an object");
  }

  const record = raw as Record<string, unknown>;
  const result = {} as Record<string, unknown>;

  for (const field of STRING_FIELDS) {
    const value = record[field];
    if (typeof value !== "string") {
      throw new Error(`parseRefactoring: field "${field}" must be a string`);
    }
    result[field] = value;
  }

  const solves = record.solves;
  if (!Array.isArray(solves)) {
    throw new Error('parseRefactoring: field "solves" must be an array');
  }
  for (const candidate of solves) {
    if (typeof candidate !== "string") {
      throw new Error('parseRefactoring: every entry in "solves" must be a string');
    }
  }
  result.solves = solves;

  return result as Refactoring;
}
