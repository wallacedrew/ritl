import PatternsComparePage from "@/design-patterns/PatternsComparePage";
import { patternsStaticParams } from "@/design-patterns/lib/patternsStaticParams";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return PatternsComparePage({ params });
}

export function generateStaticParams() {
  return patternsStaticParams();
}
