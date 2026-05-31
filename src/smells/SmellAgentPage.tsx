import { notFound } from "next/navigation";

import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import SmellDetail from "./components/SmellDetail";
import { loadSmells } from "./lib/loadSmells";

interface SmellAgentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellAgentPage({ params }: SmellAgentPageProps) {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadSmells());

  if (found === undefined) notFound();

  const { entry: smell, number } = found;
  return <SmellDetail smell={smell} number={number} lens="agent" />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
