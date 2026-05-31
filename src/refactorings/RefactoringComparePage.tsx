import { notFound } from "next/navigation";

import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { getRefactoringNeighbors } from "./lib/getRefactoringNeighbors";
import { loadFowlerRefactorings } from "./lib/loadFowlerRefactorings";
import { loadKerievsky } from "./lib/loadKerievsky";
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
  const found = findCatalogEntryBySlug(rawSlug, entriesFor(book));

  if (found === undefined) notFound();

  const { entry: refactoring, number } = found;
  // Kerievsky entries can also nemesise a refactoring; feed them in
  // alongside GoF patterns so a Fowler refactoring's "Referenced by
  // patterns" group keeps listing its Kerievsky inbound references
  // after the ADR-0007 catalog move.
  const inboundPatternNames = findInboundPatterns(refactoring.name, [
    ...loadPatterns(),
    ...loadKerievsky(),
  ]).map((pattern) => pattern.name);
  const viewModel = toRefactoringCompareDetailViewModel({
    refactoring,
    number,
    book,
    inboundPatternNames,
    neighbors: getRefactoringNeighbors(number, book),
  });

  return <CatalogCompareDetail viewModel={viewModel} />;
}

export function generateStaticParams() {
  return refactoringCompareStaticParams("fowler");
}

export function refactoringCompareStaticParams(book: RefactoringBook) {
  return generateCatalogStaticParams(entriesFor(book));
}

function entriesFor(book: RefactoringBook) {
  return book === "kerievsky" ? loadKerievsky() : loadFowlerRefactorings();
}
