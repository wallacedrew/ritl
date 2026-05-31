import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";

import { getSmellNeighbors } from "../lib/getSmellNeighbors";
import { toSmellDetailViewModel } from "../lib/toSmellDetailViewModel";

interface SmellDetailProps {
  smell: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function SmellDetail({ smell, number, lens }: SmellDetailProps) {
  const inboundPatternNames = findInboundPatterns(smell.name, loadPatterns()).map(
    (pattern) => pattern.name,
  );
  const viewModel = toSmellDetailViewModel({
    smell,
    number,
    lens,
    inboundPatternNames,
    neighbors: getSmellNeighbors(number),
  });

  return <CatalogDetail viewModel={viewModel} lens={lens} />;
}
