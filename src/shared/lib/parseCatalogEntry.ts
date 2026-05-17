import { SafetyNet } from "@/refactorings/lib/SafetyNet";

import { CatalogEntry, type CatalogKind } from "./CatalogEntry";
import { CatalogEntryName } from "./CatalogEntryName";
import { Forces, type ForcesRecord } from "./Forces";

const LEGAL_CATALOGS: readonly CatalogKind[] = ["smells", "refactorings"];

function readStringField(record: Record<string, unknown>, field: string): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new Error(`parseCatalogEntry: field "${field}" must be a string`);
  }
  return value;
}

function readCatalog(record: Record<string, unknown>): CatalogKind {
  const raw = record.catalog;
  if (typeof raw !== "string" || !(LEGAL_CATALOGS as readonly string[]).includes(raw)) {
    throw new Error(
      `parseCatalogEntry: field "catalog" must be one of ${LEGAL_CATALOGS.join(", ")}`,
    );
  }
  return raw as CatalogKind;
}

function readNemeses(
  record: Record<string, unknown>,
  ownCatalog: CatalogKind,
): readonly CatalogEntryName[] {
  const raw = record.nemeses;
  if (!Array.isArray(raw)) {
    throw new Error('parseCatalogEntry: field "nemeses" must be an array');
  }
  const oppositeCatalog: CatalogKind = ownCatalog === "smells" ? "refactorings" : "smells";
  return raw.map((candidate) => {
    if (typeof candidate !== "string") {
      throw new Error('parseCatalogEntry: every entry in "nemeses" must be a string');
    }
    return oppositeCatalog === "refactorings"
      ? CatalogEntryName.refactoring(candidate)
      : CatalogEntryName.smell(candidate);
  });
}

function readForcesRecord(record: Record<string, unknown>, lens: "human" | "agent"): ForcesRecord {
  const raw = record[lens];
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(`parseCatalogEntry: field "forces.${lens}" must be an object`);
  }
  const lensRecord = raw as Record<string, unknown>;
  return {
    symptom: readForcesField(lensRecord, lens, "symptom"),
    goal: readForcesField(lensRecord, lens, "goal"),
    pressure: readForcesField(lensRecord, lens, "pressure"),
    tradeoff: readForcesField(lensRecord, lens, "tradeoff"),
    relief: readForcesField(lensRecord, lens, "relief"),
    trap: readForcesField(lensRecord, lens, "trap"),
  };
}

function readForcesField(
  record: Record<string, unknown>,
  lens: "human" | "agent",
  field: string,
): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new Error(`parseCatalogEntry: field "forces.${lens}.${field}" must be a string`);
  }
  return value;
}

function readForces(record: Record<string, unknown>): { human: Forces; agent: Forces } {
  const raw = record.forces;
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error('parseCatalogEntry: field "forces" must be an object');
  }
  const forcesRecord = raw as Record<string, unknown>;
  return {
    human: Forces.from(readForcesRecord(forcesRecord, "human")),
    agent: Forces.from(readForcesRecord(forcesRecord, "agent")),
  };
}

function readOptionalSafetyNet(record: Record<string, unknown>): SafetyNet | undefined {
  const raw = record.safetyNet;
  if (raw === undefined) {
    return undefined;
  }
  if (typeof raw !== "string") {
    throw new Error('parseCatalogEntry: field "safetyNet" must be a string when present');
  }
  return SafetyNet.from(raw);
}

export function parseCatalogEntry(raw: unknown): CatalogEntry {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("parseCatalogEntry: expected an object");
  }
  const record = raw as Record<string, unknown>;
  const catalog = readCatalog(record);
  const name =
    catalog === "smells"
      ? CatalogEntryName.smell(readStringField(record, "name"))
      : CatalogEntryName.refactoring(readStringField(record, "name"));

  return CatalogEntry.from({
    catalog,
    name,
    nemeses: readNemeses(record, catalog),
    before: readStringField(record, "before"),
    after: readStringField(record, "after"),
    forces: readForces(record),
    safetyNet: readOptionalSafetyNet(record),
  });
}
