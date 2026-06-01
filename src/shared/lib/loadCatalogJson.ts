import type { CatalogEntry, CatalogKind } from "./CatalogEntry";
import { parseCatalogEntry } from "./parseCatalogEntry";

export interface LoadCatalogJsonArgs {
  readonly raw: unknown;
  readonly expectedCatalog: CatalogKind;
  readonly callerName: string;
  readonly sourceFile: string;
}

export function loadCatalogJson({
  raw,
  expectedCatalog,
  callerName,
  sourceFile,
}: LoadCatalogJsonArgs): CatalogEntry[] {
  if (!Array.isArray(raw)) {
    throw new Error(`${callerName}: ${sourceFile} must be an array of catalog entry objects`);
  }
  return raw.map((rawEntry) => {
    const entry = parseCatalogEntry(rawEntry);
    if (entry.catalog !== expectedCatalog) {
      throw new Error(
        `${callerName}: expected catalog "${expectedCatalog}" but got "${entry.catalog}" for ${entry.name.toString()}`,
      );
    }
    return entry;
  });
}
