import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import RefactoringCompare from "./components/RefactoringCompare";
import { findRefactoringOr404 } from "./lib/findRefactoringOr404";
import { loadRefactoringsByBook } from "./lib/loadRefactoringsByBook";

interface RefactoringComparePageProps {
  params: Promise<{ slug: string }>;
  book?: RefactoringBook;
}

export default async function RefactoringComparePage({
  params,
  book = "fowler",
}: RefactoringComparePageProps) {
  const { entry: refactoring, number } = await findRefactoringOr404(params, book);
  return <RefactoringCompare refactoring={refactoring} number={number} book={book} />;
}

export function generateStaticParams() {
  return refactoringCompareStaticParams("fowler");
}

export function refactoringCompareStaticParams(book: RefactoringBook) {
  return generateCatalogStaticParams(loadRefactoringsByBook(book));
}
