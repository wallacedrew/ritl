import PatternDetail from "./components/PatternDetail";
import { findPatternOr404 } from "./lib/findPatternOr404";

interface PatternsAgentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternsAgentPage({ params }: PatternsAgentPageProps) {
  const { entry: pattern, number } = await findPatternOr404(params);
  return <PatternDetail pattern={pattern} number={number} lens="agent" />;
}
