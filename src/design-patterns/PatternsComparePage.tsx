import { notFound } from "next/navigation";

import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { findIncomingSourcesForPattern } from "@/shared/lib/findIncomingSourcesForPattern";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { getPatternNeighbors } from "./lib/getPatternNeighbors";
import { loadPatterns } from "./lib/loadPatterns";
import { toPatternCompareDetailViewModel } from "./lib/toPatternCompareDetailViewModel";

interface PatternsComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsComparePage({ params }: PatternsComparePageProps) {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadPatterns());

  if (found === undefined) notFound();

  const { entry: pattern, number } = found;
  const viewModel = toPatternCompareDetailViewModel({
    pattern,
    number,
    incomingSourceNames: findIncomingSourcesForPattern(pattern.name),
    neighbors: getPatternNeighbors(number),
  });

  return <CatalogCompareDetail viewModel={viewModel} />;
}

export function patternsCompareStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
