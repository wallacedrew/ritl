import {
  CatalogEntry,
  LEGAL_CATALOGS,
  LEGAL_PATTERN_BOOKS,
  type Book,
  type CatalogKind,
  type PatternBook,
} from "./CatalogEntry";
import { CatalogEntryName } from "./CatalogEntryName";
import { parseCatalogBook } from "./parseCatalogBook";
import { parseCatalogForces } from "./parseCatalogForces";
import { parseCatalogNemeses } from "./parseCatalogNemeses";
import { parseDestinationPattern } from "./parseDestinationPattern";

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

export function parseCatalogEntry(raw: unknown): CatalogEntry {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("parseCatalogEntry: expected an object");
  }
  const record = raw as Record<string, unknown>;
  const catalog = readCatalog(record);
  const book = parseCatalogBook(record, catalog);
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
    destinationPattern: parseDestinationPattern(record, catalog, book),
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
