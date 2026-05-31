import type {
  Book,
  CatalogEntryTone,
  CatalogKind,
  PatternBook,
  RefactoringBook,
} from "./CatalogEntry";
import { Slug } from "./Slug";

export class CatalogEntryName {
  private constructor(
    private readonly value: string,
    private readonly kind: CatalogKind,
    private readonly book?: Book,
  ) {
    if (value.trim().length === 0) {
      throw new Error("CatalogEntryName: value cannot be empty");
    }
    if (kind === "design-patterns" && book === undefined) {
      throw new Error('CatalogEntryName: pattern names must declare a "book"');
    }
    if (kind === "smells" && book !== undefined) {
      throw new Error('CatalogEntryName: "book" is not allowed on smell names');
    }
  }

  static refactoring(value: string, book: RefactoringBook = "fowler"): CatalogEntryName {
    return new CatalogEntryName(value, "refactorings", book);
  }

  static smell(value: string): CatalogEntryName {
    return new CatalogEntryName(value, "smells");
  }

  static pattern(value: string, book: PatternBook): CatalogEntryName {
    return new CatalogEntryName(value, "design-patterns", book);
  }

  toString(): string {
    return this.value;
  }

  toSlug(): Slug {
    return Slug.from(this.value);
  }

  toCatalogHref(): string {
    return this.toSlug().toCatalogHref(this.kind, this.book);
  }

  toSnippetHref(): string {
    return this.toSlug().toSnippetHref(this.kind);
  }

  equals(other: CatalogEntryName): boolean {
    return this.value === other.value && this.kind === other.kind && this.book === other.book;
  }

  tone(): CatalogEntryTone {
    switch (this.kind) {
      case "refactorings":
        return this.book === "kerievsky" ? "kerievsky-refactoring" : "fowler-refactoring";
      case "smells":
        return "smell";
      case "design-patterns":
        return this.book === "kerievsky" ? "kerievsky-refactoring" : "pattern";
    }
  }
}
