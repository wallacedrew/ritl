import { notFound } from "next/navigation";

import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import PatternDetail from "./components/PatternDetail";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsAgentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsAgentPage({ params }: PatternsAgentPageProps) {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadPatterns());

  if (found === undefined) notFound();

  const { entry: pattern, number } = found;
  return <PatternDetail pattern={pattern} number={number} lens="agent" />;
}

export function patternsAgentStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
