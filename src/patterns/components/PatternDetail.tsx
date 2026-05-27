import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";

import { getPatternNeighbors } from "../lib/getPatternNeighbors";

interface PatternDetailProps {
  pattern: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function PatternDetail({ pattern, number, lens }: PatternDetailProps) {
  return (
    <CatalogDetail
      entry={pattern}
      number={number}
      lens={lens}
      backLinkHref="/refactoring-to-patterns"
      backLinkLabel="Patterns"
      beforeLabel="Before the pattern"
      afterLabel="After the pattern"
      neighbors={getPatternNeighbors(number)}
    />
  );
}
