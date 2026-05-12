import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

export type Smell = {
  name: CatalogEntryName;
  symptom: string;
  risk: string;
  refactorings: CatalogEntryName[];
  goal: string;
  savings: string;
  before: string;
  after: string;
};
