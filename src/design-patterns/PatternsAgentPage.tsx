import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import PatternDetail from "./components/PatternDetail";
import { findPatternOr404 } from "./lib/findPatternOr404";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsAgentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsAgentPage({ params }: PatternsAgentPageProps) {
  const { entry: pattern, number } = await findPatternOr404(params);
  return <PatternDetail pattern={pattern} number={number} lens="agent" />;
}

export function patternsAgentStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
