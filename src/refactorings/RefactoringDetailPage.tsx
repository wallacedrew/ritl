import { notFound } from "next/navigation";

import { Slug } from "@/shared/lib/Slug";

import RefactoringDetail from "./components/RefactoringDetail";
import { loadRefactorings } from "./lib/loadRefactorings";

interface RefactoringDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RefactoringDetailPage({ params }: RefactoringDetailPageProps) {
  const { slug: rawSlug } = await params;
  const requested = Slug.fromUrlPart(rawSlug);
  const refactorings = loadRefactorings();
  const index = refactorings.findIndex((candidate) => Slug.from(candidate.name).equals(requested));
  const refactoring = refactorings[index];

  if (!refactoring) {
    notFound();
  }

  return <RefactoringDetail refactoring={refactoring} number={index + 1} />;
}

export function generateStaticParams() {
  return loadRefactorings().map((refactoring) => ({
    slug: Slug.from(refactoring.name).toString(),
  }));
}
