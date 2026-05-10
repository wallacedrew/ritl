import smellsData from "../content/smells.json";
import { parseSmell } from "./parseSmell";
import type { Smell } from "./Smell";

export function loadSmells(): Smell[] {
  const raw: unknown = smellsData;
  if (!Array.isArray(raw)) {
    throw new Error("loadSmells: smells.json must be an array of smell objects");
  }
  return raw.map(parseSmell);
}
