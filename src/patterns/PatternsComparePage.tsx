import { loadKerievsky } from "@/refactorings/lib/loadKerievsky";
import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";
import { GOF } from "@/shared/lib/subSites";

import { findPatternSources } from "./lib/findPatternSources";
import { getPatternNeighbors } from "./lib/getPatternNeighbors";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsComparePage({ params }: PatternsComparePageProps) {
  const { slug: rawSlug } = await params;
  const { entry: pattern, number } = findCatalogEntryBySlug(rawSlug, loadPatterns());
  // Sources of a GoF pattern are now Kerievsky refactorings (post-ADR-0007)
  // — entries that declare `destinationPattern: { book: "gof", ... }`.
  const sources = findPatternSources(pattern.name, loadKerievsky()).map((source) => source.name);
  return (
    <CatalogCompareDetail
      entry={pattern}
      number={number}
      backLinkHref={GOF.href()}
      backLinkLabel="Patterns"
      beforeLabel="Before the pattern"
      afterLabel="After the pattern"
      neighbors={getPatternNeighbors(number)}
      incomingSources={sources}
    />
  );
}

export function patternsCompareStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
