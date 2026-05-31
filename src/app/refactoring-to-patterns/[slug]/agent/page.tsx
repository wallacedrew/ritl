import RefactoringAgentPage, {
  refactoringAgentStaticParams,
} from "@/refactorings/RefactoringAgentPage";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return RefactoringAgentPage({ params, book: "kerievsky" });
}

export function generateStaticParams() {
  return refactoringAgentStaticParams("kerievsky");
}
