import {
  LEGAL_PATTERN_BOOKS,
  LEGAL_REFACTORING_BOOKS,
  type Book,
  type CatalogKind,
} from "./CatalogEntry";

/**
 * Reads the `book` field on a raw catalog record under the rules each
 * catalog enforces:
 *
 * - smells: book must be absent.
 * - refactorings: book defaults to "fowler"; if present must be one
 *   of LEGAL_REFACTORING_BOOKS.
 * - design-patterns: book is required and must be one of
 *   LEGAL_PATTERN_BOOKS.
 */
export function parseCatalogBook(
  record: Record<string, unknown>,
  catalog: CatalogKind,
): Book | undefined {
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
