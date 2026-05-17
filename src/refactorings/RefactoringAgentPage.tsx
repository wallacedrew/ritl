import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import RefactoringAgentDetail from "./components/RefactoringAgentDetail";
import { loadRefactorings } from "./lib/loadRefactorings";

interface RefactoringAgentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RefactoringAgentPage({ params }: RefactoringAgentPageProps) {
  const { slug: rawSlug } = await params;
  const { entry: refactoring, number } = findCatalogEntryBySlug(rawSlug, loadRefactorings());
  return <RefactoringAgentDetail refactoring={refactoring} number={number} />;
}

export function generateStaticParams() {
  return generateCatalogStaticParams(loadRefactorings());
}
