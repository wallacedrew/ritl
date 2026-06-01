import { Forces, type ForcesRecord } from "./Forces";

/**
 * Reads the top-level `forces: { human, agent }` field on a raw
 * catalog record and projects each lens into a Forces value object.
 * Throws with a precise path (`forces.human.symptom`, etc.) on any
 * missing or non-string field.
 */
export function parseCatalogForces(record: Record<string, unknown>): {
  human: Forces;
  agent: Forces;
} {
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
