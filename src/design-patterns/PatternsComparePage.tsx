import PatternCompare from "./components/PatternCompare";
import { findPatternOr404 } from "./lib/findPatternOr404";

interface PatternsComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsComparePage({ params }: PatternsComparePageProps) {
  const { entry: pattern, number } = await findPatternOr404(params);
  return <PatternCompare pattern={pattern} number={number} />;
}
