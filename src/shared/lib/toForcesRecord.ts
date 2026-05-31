import type { Forces, ForcesRecord } from "./Forces";

/**
 * Projects a Forces value object onto its plain ForcesRecord shape so
 * detail view models carry only primitives. View consumers never see
 * the class.
 */
export function toForcesRecord(forces: Forces): ForcesRecord {
  return {
    symptom: forces.symptom,
    goal: forces.goal,
    pressure: forces.pressure,
    tradeoff: forces.tradeoff,
    relief: forces.relief,
    trap: forces.trap,
  };
}
