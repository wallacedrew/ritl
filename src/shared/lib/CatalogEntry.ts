import type { CatalogEntryName } from "./CatalogEntryName";
import type { Forces } from "./Forces";

export type CatalogKind = "smells" | "refactorings" | "design-patterns";
export type Lens = "human" | "agent";
export type PatternBook = "kerievsky" | "gof";
export type RefactoringBook = "fowler" | "kerievsky";
export type Book = RefactoringBook | "gof";

/**
 * Granular source label for an entry. Names what each entry actually
 * is: a smell, a Fowler refactoring, a Kerievsky refactoring (which
 * targets a GoF pattern), or a Gang of Four pattern. The chip-color
 * map in `src/shared/theme/catalogChipColor.ts` translates tone → CSS palette key.
 */
export type CatalogEntryTone = "smell" | "fowler-refactoring" | "kerievsky-refactoring" | "pattern";

export const LEGAL_CATALOGS: readonly CatalogKind[] = ["smells", "refactorings", "design-patterns"];
export const LEGAL_PATTERN_BOOKS: readonly PatternBook[] = ["kerievsky", "gof"];
export const LEGAL_REFACTORING_BOOKS: readonly RefactoringBook[] = ["fowler", "kerievsky"];

export type LensedForces = { human: Forces; agent: Forces };

export type CatalogEntryProps = {
  catalog: CatalogKind;
  name: CatalogEntryName;
  nemeses: readonly CatalogEntryName[];
  before: string;
  after: string;
  forces: LensedForces;
  exampleSource?: string;
  book?: Book;
  destinationPattern?: CatalogEntryName;
};

export class CatalogEntry implements Readonly<CatalogEntryProps> {
  readonly catalog: CatalogKind;
  readonly name: CatalogEntryName;
  readonly nemeses: readonly CatalogEntryName[];
  readonly before: string;
  readonly after: string;
  readonly forces: LensedForces;
  readonly exampleSource?: string;
  readonly book?: Book;
  readonly destinationPattern?: CatalogEntryName;

  private constructor(props: CatalogEntryProps) {
    CatalogEntry.assertCatalogIsLegal(props.catalog);
    CatalogEntry.assertBookMatchesCatalog(props.catalog, props.book);
    CatalogEntry.assertDestinationPatternIsLegal(
      props.catalog,
      props.book,
      props.destinationPattern,
    );
    CatalogEntry.assertContentIsNonEmpty(props.before, props.after);
    this.catalog = props.catalog;
    this.name = props.name;
    this.nemeses = props.nemeses;
    this.before = props.before;
    this.after = props.after;
    this.forces = props.forces;
    this.exampleSource = props.exampleSource;
    this.book = props.book;
    this.destinationPattern = props.destinationPattern;
  }

  private static assertCatalogIsLegal(catalog: CatalogKind): void {
    if (!LEGAL_CATALOGS.includes(catalog)) {
      throw new Error(`CatalogEntry: unknown catalog "${catalog}"`);
    }
  }

  private static assertBookMatchesCatalog(catalog: CatalogKind, book: Book | undefined): void {
    if (catalog === "design-patterns") {
      if (book === undefined) {
        throw new Error('CatalogEntry: pattern entries must declare a "book"');
      }
      if (!(LEGAL_PATTERN_BOOKS as readonly string[]).includes(book)) {
        throw new Error(`CatalogEntry: unknown pattern book "${book}"`);
      }
      return;
    }
    if (catalog === "refactorings") {
      CatalogEntry.assertRefactoringBookIsLegal(book);
      return;
    }
    CatalogEntry.assertSmellHasNoBook(book);
  }

  private static assertRefactoringBookIsLegal(book: Book | undefined): void {
    if (book !== undefined && !(LEGAL_REFACTORING_BOOKS as readonly string[]).includes(book)) {
      throw new Error(`CatalogEntry: unknown refactoring book "${book}"`);
    }
  }

  private static assertSmellHasNoBook(book: Book | undefined): void {
    if (book !== undefined) {
      throw new Error('CatalogEntry: "book" is only allowed on pattern or refactoring entries');
    }
  }

  private static assertDestinationPatternIsLegal(
    catalog: CatalogKind,
    book: Book | undefined,
    destinationPattern: CatalogEntryName | undefined,
  ): void {
    if (destinationPattern === undefined) return;
    const isPattern = catalog === "design-patterns";
    const isKerievskyRefactoring = catalog === "refactorings" && book === "kerievsky";
    if (!isPattern && !isKerievskyRefactoring) {
      throw new Error(
        'CatalogEntry: "destinationPattern" is only allowed on patterns or refactorings with book="kerievsky"',
      );
    }
  }

  private static assertContentIsNonEmpty(before: string, after: string): void {
    if (before.trim().length === 0) {
      throw new Error('CatalogEntry: field "before" cannot be empty');
    }
    if (after.trim().length === 0) {
      throw new Error('CatalogEntry: field "after" cannot be empty');
    }
  }

  static from(props: CatalogEntryProps): CatalogEntry {
    return new CatalogEntry(props);
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
