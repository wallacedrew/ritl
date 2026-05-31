import PatternsDetailPage, { patternsStaticParams } from "@/design-patterns/PatternsDetailPage";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return PatternsDetailPage({ params });
}

export function generateStaticParams() {
  return patternsStaticParams();
}
