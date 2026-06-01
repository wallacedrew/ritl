import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import SmellDetail from "./components/SmellDetail";
import { findSmellOr404 } from "./lib/findSmellOr404";
import { loadSmells } from "./lib/loadSmells";

interface SmellAgentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellAgentPage({ params }: SmellAgentPageProps) {
  const { entry: smell, number } = await findSmellOr404(params);
  return <SmellDetail smell={smell} number={number} lens="agent" />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
