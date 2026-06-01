import type { RefactoringBook } from "@/shared/lib/CatalogEntry";

import { backLinkForRefactoringBook } from "./backLinkForRefactoringBook";

export function refactoringLabelsForBook(book: RefactoringBook) {
  const backLink = backLinkForRefactoringBook(book);
  return {
    backLinkHref: backLink.href,
    backLinkLabel: backLink.label,
    beforeLabel: "Before the refactoring",
    afterLabel: "After the refactoring",
  } as const;
}
