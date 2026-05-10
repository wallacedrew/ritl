import refactoringsData from "../content/refactorings.json";
import { parseRefactoring } from "./parseRefactoring";
import type { Refactoring } from "./Refactoring";

export function loadRefactorings(): Refactoring[] {
  const raw: unknown = refactoringsData;
  if (!Array.isArray(raw)) {
    throw new Error("loadRefactorings: refactorings.json must be an array of refactoring objects");
  }
  return raw.map(parseRefactoring);
}
