import type { CatalogKind } from "./CatalogEntry";
import { SubSite } from "./SubSite";

export const FOWLER: SubSite = SubSite.from({
  slug: "refactoring",
  title: "Refactoring",
  catalogs: ["refactorings", "smells"],
});

export const SUB_SITES: readonly SubSite[] = [FOWLER];

export function subSiteForCatalog(catalog: CatalogKind): SubSite {
  const owner = SUB_SITES.find((subSite) => subSite.containsCatalog(catalog));
  if (owner === undefined) {
    throw new Error(`subSiteForCatalog: no sub-site hosts catalog "${catalog}"`);
  }
  return owner;
}
