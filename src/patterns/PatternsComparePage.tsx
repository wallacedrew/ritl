import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { getPatternNeighbors } from "./lib/getPatternNeighbors";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsComparePage({ params }: PatternsComparePageProps) {
  const { slug: rawSlug } = await params;
  const { entry: pattern, number } = findCatalogEntryBySlug(rawSlug, loadPatterns());
  return (
    <CatalogCompareDetail
      entry={pattern}
      number={number}
      backLinkHref="/refactoring-to-patterns"
      backLinkLabel="Patterns"
      beforeLabel="Before the pattern"
      afterLabel="After the pattern"
      neighbors={getPatternNeighbors(number)}
    />
  );
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
