import type { RefactoringBook } from "@/shared/lib/CatalogEntry";

export interface BackLink {
  readonly href: string;
  readonly label: string;
}

/**
 * The back-link target for a refactoring detail/agent/compare page.
 * Fowler entries link back to the canon index; Kerievsky entries link
 * back to the Refactoring to Patterns landing. Centralized here so
 * every page renders the same back-link shape for a given book.
 */
export function backLinkForRefactoringBook(book: RefactoringBook): BackLink {
  if (book === "kerievsky") {
    return { href: "/refactoring-to-patterns", label: "Refactoring to Patterns" };
  }
  return { href: "/refactoring/canon", label: "Refactorings" };
}
