import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens, PatternBook } from "@/shared/lib/CatalogEntry";
import { subSiteForPatternBook } from "@/shared/lib/subSites";

import { findPatternSources } from "../lib/findPatternSources";
import { getPatternNeighbors } from "../lib/getPatternNeighbors";
import { loadPatterns } from "../lib/loadPatterns";

interface PatternDetailProps {
  pattern: CatalogEntry;
  number: number;
  lens: Lens;
  book: PatternBook;
}

export default function PatternDetail({ pattern, number, lens, book }: PatternDetailProps) {
  const sources = findPatternSources(pattern.name, loadPatterns()).map((source) => source.name);

  return (
    <CatalogDetail
      entry={pattern}
      number={number}
      lens={lens}
      backLinkHref={subSiteForPatternBook(book).href()}
      backLinkLabel="Patterns"
      beforeLabel="Before the pattern"
      afterLabel="After the pattern"
      neighbors={getPatternNeighbors(number, book)}
      incomingSources={sources}
    />
  );
}
