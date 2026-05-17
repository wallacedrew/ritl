import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import RefactoringDetail from "./components/RefactoringDetail";
import { loadRefactorings } from "./lib/loadRefactorings";

interface RefactoringAgentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RefactoringAgentPage({ params }: RefactoringAgentPageProps) {
  const { slug: rawSlug } = await params;
  const { entry: refactoring, number } = findCatalogEntryBySlug(rawSlug, loadRefactorings());
  return <RefactoringDetail refactoring={refactoring} number={number} lens="agent" />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadRefactorings());
}
