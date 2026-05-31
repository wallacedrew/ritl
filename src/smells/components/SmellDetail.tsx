import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { findInboundPatternsForSmell } from "@/shared/lib/findInboundPatternsForSmell";

import { getSmellNeighbors } from "../lib/getSmellNeighbors";
import { toSmellDetailViewModel } from "../lib/toSmellDetailViewModel";

interface SmellDetailProps {
  smell: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function SmellDetail({ smell, number, lens }: SmellDetailProps) {
  const viewModel = toSmellDetailViewModel({
    smell,
    number,
    lens,
    inboundPatternNames: findInboundPatternsForSmell(smell.name),
    neighbors: getSmellNeighbors(number),
  });

  return <CatalogDetail viewModel={viewModel} lens={lens} />;
}
