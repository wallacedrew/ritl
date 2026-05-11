import { notFound } from "next/navigation";

import { slugify } from "@/shared/lib/slugify";

import RefactoringDetail from "./components/RefactoringDetail";
import { loadRefactorings } from "./lib/loadRefactorings";

interface RefactoringDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RefactoringDetailPage({ params }: RefactoringDetailPageProps) {
  const { slug } = await params;
  const refactorings = loadRefactorings();
  const index = refactorings.findIndex((candidate) => slugify(candidate.name) === slug);
  const refactoring = refactorings[index];

  if (!refactoring) {
    notFound();
  }

  return <RefactoringDetail refactoring={refactoring} number={index + 1} />;
}

export function generateStaticParams() {
  return loadRefactorings().map((refactoring) => ({ slug: slugify(refactoring.name) }));
}
