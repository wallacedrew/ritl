import type { CatalogKind } from "./CatalogEntry";
import { CatalogEntryName } from "./CatalogEntryName";

/**
 * Reads the nemeses field on a raw catalog record and projects each
 * entry to a CatalogEntryName. Dispatches on the owning catalog
 * because the legal nemesis shapes differ:
 *
 * - Smells and refactorings accept either a bare string (the opposite
 *   catalog is implied) or an object `{ catalog, name }`.
 * - Patterns require an explicit object `{ catalog, name }`; bare
 *   strings would be ambiguous (a pattern can nemesise either a
 *   refactoring or a smell).
 */
export function parseCatalogNemeses(
  record: Record<string, unknown>,
  ownCatalog: CatalogKind,
): readonly CatalogEntryName[] {
  const raw = record.nemeses;
  if (!Array.isArray(raw)) {
    throw new Error('parseCatalogEntry: field "nemeses" must be an array');
  }
  if (ownCatalog === "design-patterns") {
    return raw.map(parsePatternNemesis);
  }
  return raw.map((candidate) => parseFowlerNemesis(candidate, ownCatalog));
}

function parseFowlerNemesis(
  candidate: unknown,
  ownCatalog: "refactorings" | "smells",
): CatalogEntryName {
  if (typeof candidate === "string") {
    return nemesisFromImpliedOpposite(candidate, ownCatalog);
  }
  if (candidate !== null && typeof candidate === "object" && !Array.isArray(candidate)) {
    return nemesisFromExplicitCatalog(candidate as Record<string, unknown>);
  }
  throw new Error(
    'parseCatalogEntry: every entry in "nemeses" must be a string or an object { catalog: "refactorings" | "smells", name: string }',
  );
}

function nemesisFromImpliedOpposite(
  candidate: string,
  ownCatalog: "refactorings" | "smells",
): CatalogEntryName {
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
  return nemesisFromExplicitCatalog(candidate as Record<string, unknown>);
}

function nemesisFromExplicitCatalog(record: Record<string, unknown>): CatalogEntryName {
  const target = record.catalog;
  const name = record.name;
  if (target !== "refactorings" && target !== "smells") {
    throw new Error(
      `parseCatalogEntry: nemesis "catalog" must be "refactorings" or "smells", got ${JSON.stringify(target)}`,
    );
  }
  if (typeof name !== "string") {
    throw new Error('parseCatalogEntry: nemesis "name" must be a string');
  }
  return target === "refactorings"
    ? CatalogEntryName.refactoring(name)
    : CatalogEntryName.smell(name);
}
