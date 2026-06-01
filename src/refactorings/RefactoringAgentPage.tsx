import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import RefactoringDetail from "./components/RefactoringDetail";
import { findRefactoringOr404 } from "./lib/findRefactoringOr404";
import { loadRefactoringsByBook } from "./lib/loadRefactoringsByBook";

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
  return refactoringAgentStaticParams("fowler");
}

export function refactoringAgentStaticParams(book: RefactoringBook) {
  return generateCatalogStaticParams(loadRefactoringsByBook(book));
}
