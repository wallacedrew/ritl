import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import SmellDetail from "./components/SmellDetail";
import { loadSmells } from "./lib/loadSmells";

interface SmellDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellDetailPage({ params }: SmellDetailPageProps) {
  const { slug: rawSlug } = await params;
  const { entry: smell, number } = findCatalogEntryBySlug(rawSlug, loadSmells());
  return <SmellDetail smell={smell} number={number} />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
