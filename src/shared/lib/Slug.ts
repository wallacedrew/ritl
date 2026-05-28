import type { CatalogKind, PatternBook } from "./CatalogEntry";
import { subSiteForCatalog, subSiteForPatternBook } from "./subSites";

const SLUG_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export class Slug {
  private constructor(private readonly value: string) {}

  static from(name: string): Slug {
    return new Slug(toSlugString(name));
  }

  static fromUrlPart(raw: string): Slug {
    if (!SLUG_FORMAT.test(raw)) {
      throw new Error(`Slug.fromUrlPart: "${raw}" is not a valid slug`);
    }
    return new Slug(raw);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }

  toCatalogHref(kind: CatalogKind, book?: PatternBook): string {
    if (kind === "patterns") {
      if (book === undefined) {
        throw new Error('Slug.toCatalogHref: "book" is required when kind is "patterns"');
      }
      return subSiteForPatternBook(book).hrefForEntry(kind, this.value);
    }
    return subSiteForCatalog(kind).hrefForEntry(kind, this.value);
  }

  toSnippetHref(kind: CatalogKind): string {
    return `/snippets/${kind}/${this.value}.md`;
  }
}

function toSlugString(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
