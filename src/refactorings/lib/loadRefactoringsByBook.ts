import type { CatalogEntry, RefactoringBook } from "@/shared/lib/CatalogEntry";

import { loadFowlerRefactorings } from "./loadFowlerRefactorings";
import { loadKerievsky } from "./loadKerievsky";

export function loadRefactoringsByBook(book: RefactoringBook): CatalogEntry[] {
  return book === "kerievsky" ? loadKerievsky() : loadFowlerRefactorings();
}
