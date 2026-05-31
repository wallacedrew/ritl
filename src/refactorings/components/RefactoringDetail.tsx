import { loadPatterns } from "@/design-patterns/lib/loadPatterns";
import CatalogDetail from "@/shared/components/CatalogDetail";
import type { CatalogEntry, Lens, RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findInboundPatterns } from "@/shared/lib/findInboundPatterns";

import { backLinkForRefactoringBook } from "../lib/backLinkForRefactoringBook";
import { getRefactoringNeighbors } from "../lib/getRefactoringNeighbors";
import { loadKerievsky } from "../lib/loadKerievsky";

interface RefactoringDetailProps {
  refactoring: CatalogEntry;
  number: number;
  lens: Lens;
  book?: RefactoringBook;
}

export default function RefactoringDetail({
  refactoring,
  number,
  lens,
  book = "fowler",
}: RefactoringDetailProps) {
  const inboundPatterns = findInboundPatterns(refactoring.name, [
    ...loadPatterns(),
    ...loadKerievsky(),
  ]).map((pattern) => pattern.name);
  const backLink = backLinkForRefactoringBook(book);

  return (
    <CatalogDetail
      entry={refactoring}
      number={number}
      lens={lens}
      backLinkHref={backLink.href}
      backLinkLabel={backLink.label}
      beforeLabel="Before the refactoring"
      afterLabel="After the refactoring"
      neighbors={getRefactoringNeighbors(number, book)}
      inboundPatterns={inboundPatterns}
    />
  );
}
