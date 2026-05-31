import PatternsAgentPage, { patternsAgentStaticParams } from "@/design-patterns/PatternsAgentPage";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return PatternsAgentPage({ params });
}

export function generateStaticParams() {
  return patternsAgentStaticParams();
}
