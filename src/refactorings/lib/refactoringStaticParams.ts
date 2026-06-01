import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { loadRefactoringsByBook } from "./loadRefactoringsByBook";

export function refactoringStaticParams(book: RefactoringBook) {
  return generateCatalogStaticParams(loadRefactoringsByBook(book));
}
