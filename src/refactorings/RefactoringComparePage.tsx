import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

import { getRefactoringNeighbors } from "./lib/getRefactoringNeighbors";
import { loadRefactorings } from "./lib/loadRefactorings";

interface RefactoringComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function RefactoringComparePage({ params }: RefactoringComparePageProps) {
  const { slug: rawSlug } = await params;
  const snapshot = loadCatalogSnapshot();
  const { entry: refactoring, number } = findCatalogEntryBySlug(rawSlug, snapshot.refactorings);
  const inboundPatterns = findInboundPatterns(refactoring.name, snapshot.patterns).map(
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
      snapshot={snapshot}
    />
  );
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadRefactorings());
}
