import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import SmellDetail from "./components/SmellDetail";
import { findSmellOr404 } from "./lib/findSmellOr404";
import { loadSmells } from "./lib/loadSmells";

interface SmellDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellDetailPage({ params }: SmellDetailPageProps) {
  const { entry: smell, number } = await findSmellOr404(params);
  return <SmellDetail smell={smell} number={number} lens="human" />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
