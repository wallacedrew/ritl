import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";

import { getSmellNeighbors } from "../lib/getSmellNeighbors";

interface SmellDetailProps {
  smell: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function SmellDetail({ smell, number, lens }: SmellDetailProps) {
  const snapshot = loadCatalogSnapshot();
  const inboundPatterns = findInboundPatterns(smell.name, snapshot.patterns).map(
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
      snapshot={snapshot}
    />
  );
}
