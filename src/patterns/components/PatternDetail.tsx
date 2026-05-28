import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens, PatternBook } from "@/shared/lib/CatalogEntry";
import { subSiteForPatternBook } from "@/shared/lib/subSites";

import { getPatternNeighbors } from "../lib/getPatternNeighbors";

interface PatternDetailProps {
  pattern: CatalogEntry;
  number: number;
  lens: Lens;
  book: PatternBook;
}

export default function PatternDetail({ pattern, number, lens, book }: PatternDetailProps) {
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
    />
  );
}
