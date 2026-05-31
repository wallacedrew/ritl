import type { CatalogKind, PatternBook, RefactoringBook } from "./CatalogEntry";
import { SubSite } from "./SubSite";

export const FOWLER: SubSite = SubSite.from({
  slug: "refactoring",
  title: "Refactoring",
  catalogs: ["refactorings", "smells"],
});

export const KERIEVSKY: SubSite = SubSite.from({
  slug: "refactoring-to-patterns",
  title: "Refactoring to Patterns",
  catalogs: ["refactorings"],
});

export const GOF: SubSite = SubSite.from({
  slug: "design-patterns",
  title: "Design Patterns",
  catalogs: ["design-patterns"],
});

export const SUB_SITES: readonly SubSite[] = [FOWLER, KERIEVSKY, GOF];

export type NonPatternCatalog = Exclude<CatalogKind, "design-patterns">;

export function subSiteForCatalog(catalog: NonPatternCatalog): SubSite {
  const owner = SUB_SITES.find(
    (subSite) => subSite.containsCatalog(catalog) && !subSite.containsCatalog("design-patterns"),
  );
  if (owner === undefined) {
    throw new Error(`subSiteForCatalog: no sub-site hosts catalog "${catalog}"`);
  }
  return owner;
}

export function subSiteForPatternBook(book: PatternBook): SubSite {
  switch (book) {
    case "kerievsky":
      return KERIEVSKY;
    case "gof":
      return GOF;
  }
}

export function subSiteForRefactoringBook(book: RefactoringBook): SubSite {
  switch (book) {
    case "fowler":
      return FOWLER;
    case "kerievsky":
      return KERIEVSKY;
  }
}
