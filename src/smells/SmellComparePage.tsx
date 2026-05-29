import { loadPatterns } from "@/patterns/lib/loadPatterns";
import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { getSmellNeighbors } from "./lib/getSmellNeighbors";
import { loadSmells } from "./lib/loadSmells";

interface SmellComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellComparePage({ params }: SmellComparePageProps) {
  const { slug: rawSlug } = await params;
  const { entry: smell, number } = findCatalogEntryBySlug(rawSlug, loadSmells());
  const inboundPatterns = findInboundPatterns(smell.name, loadPatterns()).map(
    (pattern) => pattern.name,
  );
  return (
    <CatalogCompareDetail
      entry={smell}
      number={number}
      backLinkHref="/refactoring/smells"
      backLinkLabel="Smells"
      beforeLabel="Smellier version"
      afterLabel="Fresher version"
      neighbors={getSmellNeighbors(number)}
      inboundPatterns={inboundPatterns}
    />
  );
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
