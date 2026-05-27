import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

import { getSmellNeighbors } from "../lib/getSmellNeighbors";

interface SmellDetailProps {
  smell: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function SmellDetail({ smell, number, lens }: SmellDetailProps) {
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
    />
  );
}
