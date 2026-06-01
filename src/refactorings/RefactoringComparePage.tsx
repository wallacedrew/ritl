import { notFound } from "next/navigation";

import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { findInboundPatternsForRefactoring } from "@/shared/lib/findInboundPatternsForRefactoring";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

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
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadRefactoringsByBook(book));

  if (found === undefined) notFound();

  const { entry: refactoring, number } = found;
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
