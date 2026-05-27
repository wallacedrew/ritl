import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { getSmellNeighbors } from "./lib/getSmellNeighbors";
import { loadSmells } from "./lib/loadSmells";

interface SmellComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellComparePage({ params }: SmellComparePageProps) {
  const { slug: rawSlug } = await params;
  const { entry: smell, number } = findCatalogEntryBySlug(rawSlug, loadSmells());
  return (
    <CatalogCompareDetail
      entry={smell}
      number={number}
      backLinkHref="/refactoring/smells"
      backLinkLabel="Smells"
      beforeLabel="Smellier version"
      afterLabel="Fresher version"
      neighbors={getSmellNeighbors(number)}
    />
  );
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
