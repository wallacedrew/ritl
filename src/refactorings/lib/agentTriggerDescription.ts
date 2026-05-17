import type { Refactoring } from "./Refactoring";

export function agentTriggerDescription(refactoring: Refactoring): string {
  const triggers = refactoring.solves.map((solved) => solved.toString()).join(", ");
  return `Apply ${refactoring.name.toString()} when you see ${triggers}. ${refactoring.goal}`;
}
