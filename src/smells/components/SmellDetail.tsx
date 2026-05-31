import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";

import { getSmellNeighbors } from "../lib/getSmellNeighbors";

interface SmellDetailProps {
  smell: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function SmellDetail({ smell, number, lens }: SmellDetailProps) {
  const inboundPatterns = findInboundPatterns(smell.name, loadPatterns()).map(
    (pattern) => pattern.name,
  );

  return (
    <CatalogDetail
      entry={smell}
      number={number}
      lens={lens}
      backLinkHref="/refactoring/smells"
      backLinkLabel="Smells"
      beforeLabel="Smellier version"
      afterLabel="Fresher version"
      neighbors={getSmellNeighbors(number)}
      inboundPatterns={inboundPatterns}
    />
  );
}
