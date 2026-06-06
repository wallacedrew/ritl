import RefactoringDetailPage from "@/refactorings/RefactoringDetailPage";
import { refactoringStaticParams } from "@/refactorings/lib/refactoringStaticParams";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return RefactoringDetailPage({ params, book: "kerievsky" });
}

export function generateStaticParams() {
  return refactoringStaticParams("kerievsky");
}
