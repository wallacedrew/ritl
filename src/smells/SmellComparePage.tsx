import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import SmellCompare from "./components/SmellCompare";
import { findSmellOr404 } from "./lib/findSmellOr404";
import { loadSmells } from "./lib/loadSmells";

interface SmellComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellComparePage({ params }: SmellComparePageProps) {
  const { entry: smell, number } = await findSmellOr404(params);
  return <SmellCompare smell={smell} number={number} />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
