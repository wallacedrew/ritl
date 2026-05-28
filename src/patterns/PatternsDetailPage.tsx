import type { PatternBook } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import PatternDetail from "./components/PatternDetail";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsDetailPageProps {
  params: Promise<{ slug: string }>;
  book: PatternBook;
}

export default async function PatternsDetailPage({ params, book }: PatternsDetailPageProps) {
  const { slug: rawSlug } = await params;
  const { entry: pattern, number } = findCatalogEntryBySlug(rawSlug, loadPatterns(book));
  return <PatternDetail pattern={pattern} number={number} lens="human" book={book} />;
}

export function patternsStaticParams(book: PatternBook) {
  return generateCatalogStaticParams(loadPatterns(book));
}
