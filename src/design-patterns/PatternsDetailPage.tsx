import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import PatternDetail from "./components/PatternDetail";
import { findPatternOr404 } from "./lib/findPatternOr404";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsDetailPage({ params }: PatternsDetailPageProps) {
  const { entry: pattern, number } = await findPatternOr404(params);
  return <PatternDetail pattern={pattern} number={number} lens="human" />;
}

export function patternsStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
