import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { Slug } from "@/shared/lib/Slug";

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
  return loadSmells().map((smell) => ({ slug: Slug.from(smell.name).toString() }));
}
