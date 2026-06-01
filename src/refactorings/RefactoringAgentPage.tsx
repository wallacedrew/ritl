import type { RefactoringBook } from "@/shared/lib/CatalogEntry";

import RefactoringDetail from "./components/RefactoringDetail";
import { findRefactoringOr404 } from "./lib/findRefactoringOr404";
import { refactoringStaticParams } from "./lib/refactoringStaticParams";

interface RefactoringAgentPageProps {
  params: Promise<{ slug: string }>;
  book?: RefactoringBook;
}

export default async function RefactoringAgentPage({
  params,
  book = "fowler",
}: RefactoringAgentPageProps) {
  const { entry: refactoring, number } = await findRefactoringOr404(params, book);
  return <RefactoringDetail refactoring={refactoring} number={number} lens="agent" book={book} />;
}

export function generateStaticParams() {
  return refactoringStaticParams("fowler");
}
