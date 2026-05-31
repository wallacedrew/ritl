import { notFound } from "next/navigation";

import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import RefactoringDetail from "./components/RefactoringDetail";
import { loadFowlerRefactorings } from "./lib/loadFowlerRefactorings";
import { loadKerievsky } from "./lib/loadKerievsky";

interface RefactoringAgentPageProps {
  params: Promise<{ slug: string }>;
  book?: RefactoringBook;
}

export default async function RefactoringAgentPage({
  params,
  book = "fowler",
}: RefactoringAgentPageProps) {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, entriesFor(book));

  if (found === undefined) notFound();

  const { entry: refactoring, number } = found;
  return <RefactoringDetail refactoring={refactoring} number={number} lens="agent" book={book} />;
}

export function generateStaticParams() {
  return refactoringAgentStaticParams("fowler");
}

export function refactoringAgentStaticParams(book: RefactoringBook) {
  return generateCatalogStaticParams(entriesFor(book));
}

function entriesFor(book: RefactoringBook) {
  return book === "kerievsky" ? loadKerievsky() : loadFowlerRefactorings();
}
