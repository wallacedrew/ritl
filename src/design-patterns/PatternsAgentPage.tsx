import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import PatternDetail from "./components/PatternDetail";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsAgentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsAgentPage({ params }: PatternsAgentPageProps) {
  const { slug: rawSlug } = await params;
  const { entry: pattern, number } = findCatalogEntryBySlug(rawSlug, loadPatterns());
  return <PatternDetail pattern={pattern} number={number} lens="agent" />;
}

export function patternsAgentStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
