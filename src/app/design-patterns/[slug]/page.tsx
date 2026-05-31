import PatternsDetailPage, { patternsStaticParams } from "@/patterns/PatternsDetailPage";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return PatternsDetailPage({ params });
}

export function generateStaticParams() {
  return patternsStaticParams();
}
