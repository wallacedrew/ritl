import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import RefactoringDetail from "./components/RefactoringDetail";
import { loadRefactorings } from "./lib/loadRefactorings";

interface RefactoringDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RefactoringDetailPage({ params }: RefactoringDetailPageProps) {
  const { slug: rawSlug } = await params;
  const { entry: refactoring, number } = findCatalogEntryBySlug(rawSlug, loadRefactorings());
  return <RefactoringDetail refactoring={refactoring} number={number} />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadRefactorings());
}
