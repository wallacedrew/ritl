import type { CatalogEntryName } from "./CatalogEntryName";
import type { Forces } from "./Forces";
import type { SafetyNet } from "@/refactorings/lib/SafetyNet";

export type CatalogKind = "smells" | "refactorings" | "patterns";
export type Lens = "human" | "agent";

export const LEGAL_CATALOGS: readonly CatalogKind[] = ["smells", "refactorings", "patterns"];

export type CatalogEntryProps = {
  catalog: CatalogKind;
  name: CatalogEntryName;
  nemeses: readonly CatalogEntryName[];
  before: string;
  after: string;
  forces: { human: Forces; agent: Forces };
  safetyNet?: SafetyNet;
};

export class CatalogEntry {
  private constructor(
    readonly catalog: CatalogKind,
    readonly name: CatalogEntryName,
    readonly nemeses: readonly CatalogEntryName[],
    readonly before: string,
    readonly after: string,
    readonly forces: { human: Forces; agent: Forces },
    readonly safetyNet?: SafetyNet,
  ) {
    if (!LEGAL_CATALOGS.includes(catalog)) {
      throw new Error(`CatalogEntry: unknown catalog "${catalog}"`);
    }
    if (before.trim().length === 0) {
      throw new Error('CatalogEntry: field "before" cannot be empty');
    }
    if (after.trim().length === 0) {
      throw new Error('CatalogEntry: field "after" cannot be empty');
    }
  }

  static from(props: CatalogEntryProps): CatalogEntry {
    return new CatalogEntry(
      props.catalog,
      props.name,
      props.nemeses,
      props.before,
      props.after,
      props.forces,
      props.safetyNet,
    );
  }

  forcesFor(lens: Lens): Forces {
    return this.forces[lens];
  }

  href(): string {
    return this.name.toCatalogHref();
  }

  agentHref(): string {
    return `${this.href()}/agent`;
  }

  compareHref(): string {
    return `${this.href()}/compare`;
  }

  equals(other: CatalogEntry): boolean {
    return this.catalog === other.catalog && this.name.equals(other.name);
  }
}
