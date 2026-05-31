import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import RefactoringDetail from "./components/RefactoringDetail";
import { loadFowlerRefactorings } from "./lib/loadFowlerRefactorings";
import { loadKerievsky } from "./lib/loadKerievsky";

interface RefactoringDetailPageProps {
  params: Promise<{ slug: string }>;
  book?: RefactoringBook;
}

export default async function RefactoringDetailPage({
  params,
  book = "fowler",
}: RefactoringDetailPageProps) {
  const { slug: rawSlug } = await params;
  const { entry: refactoring, number } = findCatalogEntryBySlug(rawSlug, entriesFor(book));
  return <RefactoringDetail refactoring={refactoring} number={number} lens="human" book={book} />;
}

export function generateStaticParams() {
  return refactoringStaticParams("fowler");
}

export function refactoringStaticParams(book: RefactoringBook) {
  return generateCatalogStaticParams(entriesFor(book));
}

function entriesFor(book: RefactoringBook) {
  return book === "kerievsky" ? loadKerievsky() : loadFowlerRefactorings();
}
