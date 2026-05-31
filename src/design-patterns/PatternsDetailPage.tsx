import { notFound } from "next/navigation";

import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import PatternDetail from "./components/PatternDetail";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsDetailPage({ params }: PatternsDetailPageProps) {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadPatterns());

  if (found === undefined) notFound();

  const { entry: pattern, number } = found;
  return <PatternDetail pattern={pattern} number={number} lens="human" />;
}

export function patternsStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
