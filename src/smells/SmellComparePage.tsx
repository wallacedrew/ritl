import { notFound } from "next/navigation";

import CatalogCompareDetail from "@/shared/components/CatalogCompareDetail";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { findInboundPatternsForSmell } from "@/shared/lib/findInboundPatternsForSmell";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { getSmellNeighbors } from "./lib/getSmellNeighbors";
import { loadSmells } from "./lib/loadSmells";
import { toSmellCompareDetailViewModel } from "./lib/toSmellCompareDetailViewModel";

interface SmellComparePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellComparePage({ params }: SmellComparePageProps) {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadSmells());

  if (found === undefined) notFound();

  const { entry: smell, number } = found;
  const viewModel = toSmellCompareDetailViewModel({
    smell,
    number,
    inboundPatternNames: findInboundPatternsForSmell(smell.name),
    neighbors: getSmellNeighbors(number),
  });

  return <CatalogCompareDetail viewModel={viewModel} />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadSmells());
}
