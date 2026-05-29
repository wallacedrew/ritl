import {
  CatalogEntry,
  LEGAL_CATALOGS,
  LEGAL_PATTERN_BOOKS,
  type CatalogKind,
  type PatternBook,
} from "./CatalogEntry";
import { CatalogEntryName } from "./CatalogEntryName";
import { Forces, type ForcesRecord } from "./Forces";

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

function readNemeses(
  record: Record<string, unknown>,
  ownCatalog: CatalogKind,
): readonly CatalogEntryName[] {
  const raw = record.nemeses;
  if (!Array.isArray(raw)) {
    throw new Error('parseCatalogEntry: field "nemeses" must be an array');
  }
  if (ownCatalog === "patterns") {
    return raw.map(parsePatternNemesis);
  }
  return raw.map((candidate) => parseFowlerNemesis(candidate, ownCatalog));
}

function parseFowlerNemesis(
  candidate: unknown,
  ownCatalog: "refactorings" | "smells",
): CatalogEntryName {
  if (typeof candidate !== "string") {
    throw new Error('parseCatalogEntry: every entry in "nemeses" must be a string');
  }
  const oppositeCatalog: "refactorings" | "smells" =
    ownCatalog === "smells" ? "refactorings" : "smells";
  return oppositeCatalog === "refactorings"
    ? CatalogEntryName.refactoring(candidate)
    : CatalogEntryName.smell(candidate);
}

function parsePatternNemesis(candidate: unknown): CatalogEntryName {
  if (candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error(
      'parseCatalogEntry: pattern nemeses must be objects { catalog: "refactorings" | "smells", name: string }',
    );
  }
  const record = candidate as Record<string, unknown>;
  const target = record.catalog;
  const name = record.name;
  if (target !== "refactorings" && target !== "smells") {
    throw new Error(
      `parseCatalogEntry: pattern nemesis "catalog" must be "refactorings" or "smells", got ${JSON.stringify(target)}`,
    );
  }
  if (typeof name !== "string") {
    throw new Error('parseCatalogEntry: pattern nemesis "name" must be a string');
  }
  return target === "refactorings"
    ? CatalogEntryName.refactoring(name)
    : CatalogEntryName.smell(name);
}

function readForcesRecord(record: Record<string, unknown>, lens: "human" | "agent"): ForcesRecord {
  const raw = record[lens];
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(`parseCatalogEntry: field "forces.${lens}" must be an object`);
  }
  const lensRecord = raw as Record<string, unknown>;
  return {
    symptom: readForcesField(lensRecord, lens, "symptom"),
    goal: readForcesField(lensRecord, lens, "goal"),
    pressure: readForcesField(lensRecord, lens, "pressure"),
    tradeoff: readForcesField(lensRecord, lens, "tradeoff"),
    relief: readForcesField(lensRecord, lens, "relief"),
    trap: readForcesField(lensRecord, lens, "trap"),
  };
}

function readForcesField(
  record: Record<string, unknown>,
  lens: "human" | "agent",
  field: string,
): string {
  const value = record[field];
  if (typeof value !== "string") {
    throw new Error(`parseCatalogEntry: field "forces.${lens}.${field}" must be a string`);
  }
  return value;
}

function readForces(record: Record<string, unknown>): { human: Forces; agent: Forces } {
  const raw = record.forces;
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error('parseCatalogEntry: field "forces" must be an object');
  }
  const forcesRecord = raw as Record<string, unknown>;
  return {
    human: Forces.from(readForcesRecord(forcesRecord, "human")),
    agent: Forces.from(readForcesRecord(forcesRecord, "agent")),
  };
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

function readOptionalCompareDifferential(record: Record<string, unknown>): string | undefined {
  const raw = record.compareDifferential;
  if (raw === undefined) {
    return undefined;
  }
  if (typeof raw !== "string") {
    throw new Error('parseCatalogEntry: field "compareDifferential" must be a string when present');
  }
  const sentenceCount = (raw.match(/[.!?](\s|$)/g) ?? []).length;
  if (sentenceCount > 3) {
    throw new Error(
      `parseCatalogEntry: field "compareDifferential" must be at most 3 sentences (got ${sentenceCount})`,
    );
  }
  return raw;
}

function readDestinationPattern(
  record: Record<string, unknown>,
  ownCatalog: CatalogKind,
  ownBook: PatternBook | undefined,
): CatalogEntryName | undefined {
  const raw = record.destinationPattern;
  if (raw === undefined) {
    return undefined;
  }
  if (ownCatalog !== "patterns") {
    throw new Error(
      'parseCatalogEntry: field "destinationPattern" is only allowed on pattern entries',
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

function readPatternBook(
  record: Record<string, unknown>,
  catalog: CatalogKind,
): PatternBook | undefined {
  const raw = record.book;
  if (catalog !== "patterns") {
    if (raw !== undefined) {
      throw new Error('parseCatalogEntry: field "book" is only allowed on pattern entries');
    }
    return undefined;
  }
  if (raw === undefined) {
    throw new Error('parseCatalogEntry: pattern entries must declare a "book"');
  }
  if (typeof raw !== "string" || !(LEGAL_PATTERN_BOOKS as readonly string[]).includes(raw)) {
    throw new Error(
      `parseCatalogEntry: field "book" must be one of ${LEGAL_PATTERN_BOOKS.join(", ")}`,
    );
  }
  return raw as PatternBook;
}

export function parseCatalogEntry(raw: unknown): CatalogEntry {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("parseCatalogEntry: expected an object");
  }
  const record = raw as Record<string, unknown>;
  const catalog = readCatalog(record);
  const book = readPatternBook(record, catalog);
  const name = readCatalogEntryName(record, catalog, book);

  return CatalogEntry.from({
    catalog,
    name,
    nemeses: readNemeses(record, catalog),
    before: readStringField(record, "before"),
    after: readStringField(record, "after"),
    forces: readForces(record),
    exampleSource: readOptionalExampleSource(record),
    book,
    destinationPattern: readDestinationPattern(record, catalog, book),
    compareDifferential: readOptionalCompareDifferential(record),
  });
}

function readCatalogEntryName(
  record: Record<string, unknown>,
  catalog: CatalogKind,
  book: PatternBook | undefined,
): CatalogEntryName {
  const rawName = readStringField(record, "name");
  switch (catalog) {
    case "smells":
      return CatalogEntryName.smell(rawName);
    case "refactorings":
      return CatalogEntryName.refactoring(rawName);
    case "patterns":
      if (book === undefined) {
        throw new Error('parseCatalogEntry: pattern entries must declare a "book"');
      }
      return CatalogEntryName.pattern(rawName, book);
  }
}
