import PatternDetail from "./components/PatternDetail";
import { findPatternOr404 } from "./lib/findPatternOr404";

interface PatternsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsDetailPage({ params }: PatternsDetailPageProps) {
  const { entry: pattern, number } = await findPatternOr404(params);
  return <PatternDetail pattern={pattern} number={number} lens="human" />;
}
