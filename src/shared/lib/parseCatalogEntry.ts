import {
  CatalogEntry,
  LEGAL_CATALOGS,
  LEGAL_PATTERN_BOOKS,
  LEGAL_REFACTORING_BOOKS,
  type Book,
  type CatalogKind,
  type PatternBook,
} from "./CatalogEntry";
import { CatalogEntryName } from "./CatalogEntryName";
import { parseCatalogForces } from "./parseCatalogForces";
import { parseCatalogNemeses } from "./parseCatalogNemeses";

function readStringField(record: Record<string, unknown>, field: string): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new Error(`parseCatalogEntry: field "${field}" must be a string`);
  }
  return value;
}

function readCatalog(record: Record<string, unknown>): CatalogKind {
  const raw = record.catalog;
  if (typeof raw !== "string" || !(LEGAL_CATALOGS as readonly string[]).includes(raw)) {
    throw new Error(
      `parseCatalogEntry: field "catalog" must be one of ${LEGAL_CATALOGS.join(", ")}`,
    );
  }
  return raw as CatalogKind;
}

function readOptionalExampleSource(record: Record<string, unknown>): string | undefined {
  const raw = record.exampleSource;
  if (raw === undefined) {
    return undefined;
  }
  if (typeof raw !== "string") {
    throw new Error('parseCatalogEntry: field "exampleSource" must be a string when present');
  }
  return raw;
}

function readDestinationPattern(
  record: Record<string, unknown>,
  ownCatalog: CatalogKind,
  ownBook: Book | undefined,
): CatalogEntryName | undefined {
  const raw = record.destinationPattern;
  if (raw === undefined) {
    return undefined;
  }
  const isPattern = ownCatalog === "design-patterns";
  const isKerievskyRefactoring = ownCatalog === "refactorings" && ownBook === "kerievsky";
  if (!isPattern && !isKerievskyRefactoring) {
    throw new Error(
      'parseCatalogEntry: field "destinationPattern" is only allowed on patterns or refactorings with book="kerievsky"',
    );
  }
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(
      'parseCatalogEntry: field "destinationPattern" must be an object { book, name }',
    );
  }
  const ref = raw as Record<string, unknown>;
  const book = ref.book;
  const name = ref.name;
  if (typeof book !== "string" || !(LEGAL_PATTERN_BOOKS as readonly string[]).includes(book)) {
    throw new Error(
      `parseCatalogEntry: "destinationPattern.book" must be one of ${LEGAL_PATTERN_BOOKS.join(", ")}`,
    );
  }
  if (book === ownBook) {
    throw new Error(
      `parseCatalogEntry: "destinationPattern" must point at a pattern in a different book (got "${book}")`,
    );
  }
  if (typeof name !== "string") {
    throw new Error('parseCatalogEntry: "destinationPattern.name" must be a string');
  }
  return CatalogEntryName.pattern(name, book as PatternBook);
}

function readBook(record: Record<string, unknown>, catalog: CatalogKind): Book | undefined {
  const raw = record.book;
  if (catalog === "smells") {
    if (raw !== undefined) {
      throw new Error('parseCatalogEntry: field "book" is not allowed on smell entries');
    }
    return undefined;
  }
  if (catalog === "refactorings") {
    if (raw === undefined) {
      return "fowler";
    }
    if (typeof raw !== "string" || !(LEGAL_REFACTORING_BOOKS as readonly string[]).includes(raw)) {
      throw new Error(
        `parseCatalogEntry: field "book" on a refactoring must be one of ${LEGAL_REFACTORING_BOOKS.join(", ")}`,
      );
    }
    return raw as Book;
  }
  if (raw === undefined) {
    throw new Error('parseCatalogEntry: pattern entries must declare a "book"');
  }
  if (typeof raw !== "string" || !(LEGAL_PATTERN_BOOKS as readonly string[]).includes(raw)) {
    throw new Error(
      `parseCatalogEntry: field "book" on a pattern must be one of ${LEGAL_PATTERN_BOOKS.join(", ")}`,
    );
  }
  return raw as Book;
}

export function parseCatalogEntry(raw: unknown): CatalogEntry {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("parseCatalogEntry: expected an object");
  }
  const record = raw as Record<string, unknown>;
  const catalog = readCatalog(record);
  const book = readBook(record, catalog);
  const name = readCatalogEntryName(record, catalog, book);

  return CatalogEntry.from({
    catalog,
    name,
    nemeses: parseCatalogNemeses(record, catalog),
    before: readStringField(record, "before"),
    after: readStringField(record, "after"),
    forces: parseCatalogForces(record),
    exampleSource: readOptionalExampleSource(record),
    book,
    destinationPattern: readDestinationPattern(record, catalog, book),
  });
}

function readCatalogEntryName(
  record: Record<string, unknown>,
  catalog: CatalogKind,
  book: Book | undefined,
): CatalogEntryName {
  const rawName = readStringField(record, "name");
  switch (catalog) {
    case "smells":
      return CatalogEntryName.smell(rawName);
    case "refactorings":
      return CatalogEntryName.refactoring(rawName, book === "kerievsky" ? "kerievsky" : "fowler");
    case "design-patterns":
      if (book === undefined || !(LEGAL_PATTERN_BOOKS as readonly string[]).includes(book)) {
        throw new Error('parseCatalogEntry: pattern entries must declare a "book"');
      }
      return CatalogEntryName.pattern(rawName, book as PatternBook);
  }
}
