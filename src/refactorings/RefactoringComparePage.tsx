import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { backLinkForRefactoringBook } from "./lib/backLinkForRefactoringBook";
import { getRefactoringNeighbors } from "./lib/getRefactoringNeighbors";
import { loadFowlerRefactorings } from "./lib/loadFowlerRefactorings";
import { loadKerievsky } from "./lib/loadKerievsky";

interface RefactoringComparePageProps {
  params: Promise<{ slug: string }>;
  book?: RefactoringBook;
}

export default async function RefactoringComparePage({
  params,
  book = "fowler",
}: RefactoringComparePageProps) {
  const { slug: rawSlug } = await params;
  const { entry: refactoring, number } = findCatalogEntryBySlug(rawSlug, entriesFor(book));
  // Kerievsky entries can also nemesise a refactoring; feed them in
  // alongside GoF patterns so a Fowler refactoring's "Referenced by
  // patterns" group keeps listing its Kerievsky inbound references
  // after the ADR-0007 catalog move.
  const inboundPatterns = findInboundPatterns(refactoring.name, [
    ...loadPatterns(),
    ...loadKerievsky(),
  ]).map((pattern) => pattern.name);
  const backLink = backLinkForRefactoringBook(book);
  return (
    <CatalogCompareDetail
      entry={refactoring}
      number={number}
      backLinkHref={backLink.href}
      backLinkLabel={backLink.label}
      beforeLabel="Before the refactoring"
      afterLabel="After the refactoring"
      neighbors={getRefactoringNeighbors(number, book)}
      inboundPatterns={inboundPatterns}
    />
  );
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
