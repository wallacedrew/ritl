import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

import { getSmellNeighbors } from "./lib/getSmellNeighbors";
import { loadSmells } from "./lib/loadSmells";

interface SmellComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellComparePage({ params }: SmellComparePageProps) {
  const { slug: rawSlug } = await params;
  const snapshot = loadCatalogSnapshot();
  const { entry: smell, number } = findCatalogEntryBySlug(rawSlug, snapshot.smells);
  const inboundPatterns = findInboundPatterns(smell.name, snapshot.patterns).map(
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
      snapshot={snapshot}
    />
  );
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
