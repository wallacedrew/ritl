import { notFound } from "next/navigation";

import { loadKerievsky } from "@/refactorings/lib/loadKerievsky";
import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { findPatternSources } from "./lib/findPatternSources";
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
  // Sources of a GoF pattern are now Kerievsky refactorings (post-ADR-0007)
  // — entries that declare `destinationPattern: { book: "gof", ... }`.
  const incomingSourceNames = findPatternSources(pattern.name, loadKerievsky()).map(
    (source) => source.name,
  );
  const viewModel = toPatternCompareDetailViewModel({
    pattern,
    number,
    incomingSourceNames,
    neighbors: getPatternNeighbors(number),
  });

  return <CatalogCompareDetail viewModel={viewModel} />;
}

export function patternsCompareStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
