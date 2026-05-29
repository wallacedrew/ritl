import { loadPatterns } from "@/patterns/lib/loadPatterns";
import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { getRefactoringNeighbors } from "./lib/getRefactoringNeighbors";
import { loadRefactorings } from "./lib/loadRefactorings";

interface RefactoringComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function RefactoringComparePage({ params }: RefactoringComparePageProps) {
  const { slug: rawSlug } = await params;
  const { entry: refactoring, number } = findCatalogEntryBySlug(rawSlug, loadRefactorings());
  const inboundPatterns = findInboundPatterns(refactoring.name, loadPatterns()).map(
    (pattern) => pattern.name,
  );
  return (
    <CatalogCompareDetail
      entry={refactoring}
      number={number}
      backLinkHref="/refactoring/canon"
      backLinkLabel="Refactorings"
      beforeLabel="Before the refactoring"
      afterLabel="After the refactoring"
      neighbors={getRefactoringNeighbors(number)}
      inboundPatterns={inboundPatterns}
    />
  );
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadRefactorings());
}
