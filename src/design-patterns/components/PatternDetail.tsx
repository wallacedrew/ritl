import { loadKerievsky } from "@/refactorings/lib/loadKerievsky";
import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens } from "@/shared/lib/CatalogEntry";
import { GOF } from "@/shared/lib/subSites";

import { findPatternSources } from "../lib/findPatternSources";
import { getPatternNeighbors } from "../lib/getPatternNeighbors";

interface PatternDetailProps {
  pattern: CatalogEntry;
  number: number;
  lens: Lens;
}

export default function PatternDetail({ pattern, number, lens }: PatternDetailProps) {
  // Sources of a GoF pattern post-ADR-0007 are Kerievsky refactorings that
  // declare `destinationPattern: { book: "gof", ... }`.
  const sources = findPatternSources(pattern.name, loadKerievsky()).map((source) => source.name);

  return (
    <CatalogDetail
      entry={pattern}
      number={number}
      lens={lens}
      backLinkHref={GOF.href()}
      backLinkLabel="Patterns"
      beforeLabel="Before the pattern"
      afterLabel="After the pattern"
      neighbors={getPatternNeighbors(number)}
      incomingSources={sources}
    />
  );
}
