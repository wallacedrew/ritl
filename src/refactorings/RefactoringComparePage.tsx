import type { RefactoringBook } from "@/shared/lib/CatalogEntry";

import RefactoringCompare from "./components/RefactoringCompare";
import { findRefactoringOr404 } from "./lib/findRefactoringOr404";
import { refactoringStaticParams } from "./lib/refactoringStaticParams";

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
  return refactoringStaticParams("fowler");
}
