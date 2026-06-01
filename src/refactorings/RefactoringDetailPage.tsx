import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import RefactoringDetail from "./components/RefactoringDetail";
import { findRefactoringOr404 } from "./lib/findRefactoringOr404";
import { loadRefactoringsByBook } from "./lib/loadRefactoringsByBook";

interface RefactoringDetailPageProps {
  params: Promise<{ slug: string }>;
  book?: RefactoringBook;
}

export default async function RefactoringDetailPage({
  params,
  book = "fowler",
}: RefactoringDetailPageProps) {
  const { entry: refactoring, number } = await findRefactoringOr404(params, book);
  return <RefactoringDetail refactoring={refactoring} number={number} lens="human" book={book} />;
}

export function generateStaticParams() {
  return refactoringStaticParams("fowler");
}

export function refactoringStaticParams(book: RefactoringBook) {
  return generateCatalogStaticParams(loadRefactoringsByBook(book));
}
