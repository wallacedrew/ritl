import type { CatalogKind } from "./CatalogEntry";
import { Slug } from "./Slug";

export class CatalogEntryName {
  private constructor(
    private readonly value: string,
    private readonly kind: CatalogKind,
  ) {
    if (value.trim().length === 0) {
      throw new Error("CatalogEntryName: value cannot be empty");
    }
  }

  static refactoring(value: string): CatalogEntryName {
    return new CatalogEntryName(value, "refactorings");
  }

  static smell(value: string): CatalogEntryName {
    return new CatalogEntryName(value, "smells");
  }

  toString(): string {
    return this.value;
  }

  toSlug(): Slug {
    return Slug.from(this.value);
  }

  toCatalogHref(): string {
    return this.toSlug().toCatalogHref(this.kind);
  }

  toSnippetHref(): string {
    return this.toSlug().toSnippetHref(this.kind);
  }

  equals(other: CatalogEntryName): boolean {
    return this.value === other.value && this.kind === other.kind;
  }
}
