import { notFound } from "next/navigation";

import type { RefactoringBook } from "@/shared/lib/CatalogEntry";
import { findCatalogEntryBySlug } from "@/shared/lib/findCatalogEntryBySlug";
import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import RefactoringDetail from "./components/RefactoringDetail";
import { loadRefactoringsByBook } from "./lib/loadRefactoringsByBook";

interface RefactoringDetailPageProps {
  params: Promise<{ slug: string }>;
  book?: RefactoringBook;
}

export default async function RefactoringDetailPage({
  params,
  book = "fowler",
}: RefactoringDetailPageProps) {
  const { slug: rawSlug } = await params;
  const found = findCatalogEntryBySlug(rawSlug, loadRefactoringsByBook(book));

  if (found === undefined) notFound();

  const { entry: refactoring, number } = found;
  return <RefactoringDetail refactoring={refactoring} number={number} lens="human" book={book} />;
}

export function generateStaticParams() {
  return refactoringStaticParams("fowler");
}

export function refactoringStaticParams(book: RefactoringBook) {
  return generateCatalogStaticParams(loadRefactoringsByBook(book));
}
