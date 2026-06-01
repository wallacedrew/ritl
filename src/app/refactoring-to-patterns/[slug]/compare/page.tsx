import RefactoringComparePage from "@/refactorings/RefactoringComparePage";
import { refactoringStaticParams } from "@/refactorings/lib/refactoringStaticParams";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return RefactoringComparePage({ params, book: "kerievsky" });
}

export function generateStaticParams() {
  return refactoringStaticParams("kerievsky");
}
