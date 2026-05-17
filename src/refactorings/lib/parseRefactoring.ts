import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

import type { Refactoring } from "./Refactoring";
import { SafetyNet } from "./SafetyNet";

function readStringField(record: Record<string, unknown>, field: string): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new Error(`parseRefactoring: field "${field}" must be a string`);
  }
  return value;
}

function readOptionalSafetyNet(record: Record<string, unknown>): SafetyNet | undefined {
  const raw = record.safetyNet;
  if (raw === undefined) {
    return undefined;
  }
  if (typeof raw !== "string") {
    throw new Error('parseRefactoring: field "safetyNet" must be a string when present');
  }
  return SafetyNet.from(raw);
}

function readOptionalString(record: Record<string, unknown>, field: string): string | undefined {
  const raw = record[field];
  if (raw === undefined) {
    return undefined;
  }
  if (typeof raw !== "string") {
    throw new Error(`parseRefactoring: field "${field}" must be a string when present`);
  }
  return raw;
}

export function parseRefactoring(raw: unknown): Refactoring {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("parseRefactoring: expected an object");
  }

  const record = raw as Record<string, unknown>;

  const solves = record.solves;
  if (!Array.isArray(solves)) {
    throw new Error('parseRefactoring: field "solves" must be an array');
  }
  const wrappedSolves: CatalogEntryName[] = solves.map((candidate) => {
    if (typeof candidate !== "string") {
      throw new Error('parseRefactoring: every entry in "solves" must be a string');
    }
    return CatalogEntryName.smell(candidate);
  });

  return {
    name: CatalogEntryName.refactoring(readStringField(record, "name")),
    solves: wrappedSolves,
    tradeoff: readStringField(record, "tradeoff"),
    goal: readStringField(record, "goal"),
    savings: readStringField(record, "savings"),
    before: readStringField(record, "before"),
    after: readStringField(record, "after"),
    safetyNet: readOptionalSafetyNet(record),
    failureMode: readOptionalString(record, "failureMode"),
  };
}
