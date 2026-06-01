import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import { findInboundPatternsForSmell } from "@/shared/lib/findInboundPatternsForSmell";

import { getSmellNeighbors } from "../lib/getSmellNeighbors";
import { toSmellCompareDetailViewModel } from "../lib/toSmellCompareDetailViewModel";

interface SmellCompareProps {
  smell: CatalogEntry;
  number: number;
}

export default function SmellCompare({ smell, number }: SmellCompareProps) {
  const viewModel = toSmellCompareDetailViewModel({
    smell,
    number,
    inboundPatternNames: findInboundPatternsForSmell(smell.name),
    neighbors: getSmellNeighbors(number),
  });

  return <CatalogCompareDetail viewModel={viewModel} />;
}
