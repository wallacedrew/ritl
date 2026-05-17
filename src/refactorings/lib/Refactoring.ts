import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

import type { SafetyNet } from "./SafetyNet";

export type Refactoring = {
  name: CatalogEntryName;
  solves: CatalogEntryName[];
  tradeoff: string;
  goal: string;
  savings: string;
  before: string;
  after: string;
  safetyNet?: SafetyNet;
  failureMode?: string;
};
