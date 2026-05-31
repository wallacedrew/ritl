import PatternsComparePage, {
  patternsCompareStaticParams,
} from "@/design-patterns/PatternsComparePage";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return PatternsComparePage({ params });
}

export function generateStaticParams() {
  return patternsCompareStaticParams();
}
