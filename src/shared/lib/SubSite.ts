import type { CatalogKind } from "./CatalogEntry";

/**
 * URL-facing segment for each catalog. Decoupled from CatalogKind so the
 * URL can read more naturally than the data-model identifier — e.g. the
 * "refactorings" catalog is published under `/refactoring/canon` because
 * "the canon" reads better than the repeated word.
 */
const CATALOG_URL_SEGMENT: Record<CatalogKind, string> = {
  refactorings: "canon",
  smells: "smells",
  patterns: "patterns",
};

function urlSegmentFor(catalog: CatalogKind): string {
  return CATALOG_URL_SEGMENT[catalog];
}

export interface SubSiteProps {
  slug: string;
  title: string;
  catalogs: readonly CatalogKind[];
}

export class SubSite {
  private constructor(
    readonly slug: string,
    readonly title: string,
    readonly catalogs: readonly CatalogKind[],
  ) {
    if (slug.trim().length === 0) {
      throw new Error("SubSite: slug cannot be empty");
    }
    if (title.trim().length === 0) {
      throw new Error("SubSite: title cannot be empty");
    }
    if (catalogs.length === 0) {
      throw new Error("SubSite: catalogs cannot be empty");
    }
  }

  static from(props: SubSiteProps): SubSite {
    return new SubSite(props.slug, props.title, [...props.catalogs]);
  }

  href(): string {
    return `/${this.slug}`;
  }

  primaryCatalog(): CatalogKind {
    const first = this.catalogs[0];
    if (first === undefined) {
      throw new Error(`SubSite "${this.slug}" has no catalogs`);
    }
    return first;
  }

  primaryLandingHref(): string {
    return this.hrefForCatalog(this.primaryCatalog());
  }

  hrefForCatalog(catalog: CatalogKind): string {
    this.assertContains(catalog);
    return this.hasMultipleCatalogs() ? `/${this.slug}/${urlSegmentFor(catalog)}` : `/${this.slug}`;
  }

  hrefForEntry(catalog: CatalogKind, entrySlug: string): string {
    this.assertContains(catalog);
    return this.hasMultipleCatalogs()
      ? `/${this.slug}/${urlSegmentFor(catalog)}/${entrySlug}`
      : `/${this.slug}/${entrySlug}`;
  }

  containsCatalog(catalog: CatalogKind): boolean {
    return this.catalogs.includes(catalog);
  }

  equals(other: SubSite): boolean {
    return this.slug === other.slug;
  }

  private assertContains(catalog: CatalogKind): void {
    if (!this.containsCatalog(catalog)) {
      throw new Error(`SubSite "${this.slug}" does not contain catalog "${catalog}"`);
    }
  }

  private hasMultipleCatalogs(): boolean {
    return this.catalogs.length > 1;
  }
}
