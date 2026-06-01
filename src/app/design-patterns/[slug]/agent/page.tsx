import PatternsAgentPage from "@/design-patterns/PatternsAgentPage";
import { patternsStaticParams } from "@/design-patterns/lib/patternsStaticParams";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return PatternsAgentPage({ params });
}

export function generateStaticParams() {
  return patternsStaticParams();
}
