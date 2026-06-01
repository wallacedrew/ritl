import { LEGAL_PATTERN_BOOKS, type Book, type CatalogKind, type PatternBook } from "./CatalogEntry";
import { CatalogEntryName } from "./CatalogEntryName";

/**
 * Reads the optional `destinationPattern: { book, name }` field on a
 * raw catalog record. Only patterns and Kerievsky refactorings may
 * declare one; the destination must point at a pattern in a different
 * book than the owning entry.
 */
export function parseDestinationPattern(
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
