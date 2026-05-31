import RefactoringComparePage, {
  refactoringCompareStaticParams,
} from "@/refactorings/RefactoringComparePage";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return RefactoringComparePage({ params, book: "kerievsky" });
}

export function generateStaticParams() {
  return refactoringCompareStaticParams("kerievsky");
}
