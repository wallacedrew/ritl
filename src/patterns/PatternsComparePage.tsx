import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import type { PatternBook } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";
import { loadCatalogSnapshot } from "@/shared/lib/loadCatalogSnapshot";
import { subSiteForPatternBook } from "@/shared/lib/subSites";

import { findPatternSources } from "./lib/findPatternSources";
import { getPatternNeighbors } from "./lib/getPatternNeighbors";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsComparePageProps {
  params: Promise<{ slug: string }>;
  book: PatternBook;
}

export default async function PatternsComparePage({ params, book }: PatternsComparePageProps) {
  const { slug: rawSlug } = await params;
  const snapshot = loadCatalogSnapshot();
  const { entry: pattern, number } = findCatalogEntryBySlug(rawSlug, loadPatterns(book));
  const sources = findPatternSources(pattern.name, snapshot.patterns).map((source) => source.name);
  return (
    <CatalogCompareDetail
      entry={pattern}
      number={number}
      backLinkHref={subSiteForPatternBook(book).href()}
      backLinkLabel="Patterns"
      beforeLabel="Before the pattern"
      afterLabel="After the pattern"
      neighbors={getPatternNeighbors(number, book)}
      incomingSources={sources}
      snapshot={snapshot}
    />
  );
}

export function patternsCompareStaticParams(book: PatternBook) {
  return generateCatalogStaticParams(loadPatterns(book));
}
