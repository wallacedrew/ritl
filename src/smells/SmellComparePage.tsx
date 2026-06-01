import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findInboundPatternsForSmell } from "@/shared/lib/findInboundPatternsForSmell";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { findSmellOr404 } from "./lib/findSmellOr404";
import { getSmellNeighbors } from "./lib/getSmellNeighbors";
import { loadSmells } from "./lib/loadSmells";
import { toSmellCompareDetailViewModel } from "./lib/toSmellCompareDetailViewModel";

interface SmellComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellComparePage({ params }: SmellComparePageProps) {
  const { entry: smell, number } = await findSmellOr404(params);
  const viewModel = toSmellCompareDetailViewModel({
    smell,
    number,
    inboundPatternNames: findInboundPatternsForSmell(smell.name),
    neighbors: getSmellNeighbors(number),
  });

  return <CatalogCompareDetail viewModel={viewModel} />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
