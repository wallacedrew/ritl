import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import PatternCompare from "./components/PatternCompare";
import { findPatternOr404 } from "./lib/findPatternOr404";
import { loadPatterns } from "./lib/loadPatterns";

interface PatternsComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsComparePage({ params }: PatternsComparePageProps) {
  const { entry: pattern, number } = await findPatternOr404(params);
  return <PatternCompare pattern={pattern} number={number} />;
}

export function patternsCompareStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
