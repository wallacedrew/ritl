import type { CatalogKind } from "./CatalogEntry";

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

  hrefForCatalog(catalog: CatalogKind): string {
    this.assertContains(catalog);
    return this.hasMultipleCatalogs() ? `/${this.slug}/${catalog}` : `/${this.slug}`;
  }

  hrefForEntry(catalog: CatalogKind, entrySlug: string): string {
    this.assertContains(catalog);
    return this.hasMultipleCatalogs()
      ? `/${this.slug}/${catalog}/${entrySlug}`
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
