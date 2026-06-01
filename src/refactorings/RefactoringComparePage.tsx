import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findInboundPatternsForRefactoring } from "@/shared/lib/findInboundPatternsForRefactoring";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { findRefactoringOr404 } from "./lib/findRefactoringOr404";
import { getRefactoringNeighbors } from "./lib/getRefactoringNeighbors";
import { loadRefactoringsByBook } from "./lib/loadRefactoringsByBook";
import { toRefactoringCompareDetailViewModel } from "./lib/toRefactoringCompareDetailViewModel";

interface RefactoringComparePageProps {
  params: Promise<{ slug: string }>;
  book?: RefactoringBook;
}

export default async function RefactoringComparePage({
  params,
  book = "fowler",
}: RefactoringComparePageProps) {
  const { entry: refactoring, number } = await findRefactoringOr404(params, book);
  const viewModel = toRefactoringCompareDetailViewModel({
    refactoring,
    number,
    book,
    inboundPatternNames: findInboundPatternsForRefactoring(refactoring.name),
    neighbors: getRefactoringNeighbors(number, book),
  });

  return <CatalogCompareDetail viewModel={viewModel} />;
}

export function generateStaticParams() {
  return refactoringCompareStaticParams("fowler");
}

export function refactoringCompareStaticParams(book: RefactoringBook) {
  return generateCatalogStaticParams(loadRefactoringsByBook(book));
}
