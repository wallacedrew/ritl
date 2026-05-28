import PatternsComparePage, { patternsCompareStaticParams } from "@/patterns/PatternsComparePage";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return PatternsComparePage({ params, book: "kerievsky" });
}

export function generateStaticParams() {
  return patternsCompareStaticParams("kerievsky");
}
