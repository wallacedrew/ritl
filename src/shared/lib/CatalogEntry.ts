import type { CatalogEntryName } from "./CatalogEntryName";
import type { Forces } from "./Forces";
import type { SafetyNet } from "@/refactorings/lib/SafetyNet";

export type CatalogKind = "smells" | "refactorings" | "patterns";
export type Lens = "human" | "agent";
export type PatternBook = "kerievsky" | "gof";

/**
 * Granular source label for an entry. Distinguishes Kerievsky from GoF
 * patterns (both of which have CatalogKind "patterns") so the UI can
 * color-code chips and search dots by source.
 */
export type CatalogEntryTone = "refactoring" | "smell" | "kerievsky-pattern" | "gof-pattern";

export const LEGAL_CATALOGS: readonly CatalogKind[] = ["smells", "refactorings", "patterns"];
export const LEGAL_PATTERN_BOOKS: readonly PatternBook[] = ["kerievsky", "gof"];

export type CatalogEntryProps = {
  catalog: CatalogKind;
  name: CatalogEntryName;
  nemeses: readonly CatalogEntryName[];
  before: string;
  after: string;
  forces: { human: Forces; agent: Forces };
  safetyNet?: SafetyNet;
  exampleSource?: string;
  book?: PatternBook;
  destinationPattern?: CatalogEntryName;
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
    readonly exampleSource?: string,
    readonly book?: PatternBook,
    readonly destinationPattern?: CatalogEntryName,
  ) {
    if (!LEGAL_CATALOGS.includes(catalog)) {
      throw new Error(`CatalogEntry: unknown catalog "${catalog}"`);
    }
    if (catalog === "patterns") {
      if (book === undefined) {
        throw new Error('CatalogEntry: pattern entries must declare a "book"');
      }
      if (!LEGAL_PATTERN_BOOKS.includes(book)) {
        throw new Error(`CatalogEntry: unknown pattern book "${book}"`);
      }
    } else if (book !== undefined) {
      throw new Error('CatalogEntry: "book" is only allowed on pattern entries');
    }
    if (destinationPattern !== undefined && catalog !== "patterns") {
      throw new Error('CatalogEntry: "destinationPattern" is only allowed on pattern entries');
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
      props.exampleSource,
      props.book,
      props.destinationPattern,
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
