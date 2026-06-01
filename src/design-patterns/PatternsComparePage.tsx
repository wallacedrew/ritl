import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findIncomingSourcesForPattern } from "@/shared/lib/findIncomingSourcesForPattern";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { findPatternOr404 } from "./lib/findPatternOr404";
import { getPatternNeighbors } from "./lib/getPatternNeighbors";
import { loadPatterns } from "./lib/loadPatterns";
import { toPatternCompareDetailViewModel } from "./lib/toPatternCompareDetailViewModel";

interface PatternsComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsComparePage({ params }: PatternsComparePageProps) {
  const { entry: pattern, number } = await findPatternOr404(params);
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
